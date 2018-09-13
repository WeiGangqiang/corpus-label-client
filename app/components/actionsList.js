import React, {Component} from 'react'
import {Table, Button, Icon, Input, Select, message, Popconfirm} from 'antd'

import {getIntentActions, updateIntentActions} from 'actions/intent'
import {IntentSelect} from 'components/forwardIntent/intentSelect'

import {connect} from 'react-redux'

const Option = Select.Option;

const typeArray = [
    {
        name: 'replies',
        zhName: '文本回复'
    },
    {
        name: 'api-call',
        zhName: '函数调用'
    },
    {
        name: 'forward',
        zhName: '跳转'
    }
]

@connect((state, dispatch) => ({
}))

export class ActionsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            actions: [
            ],

            values: [],
            type: 'replies',
            typeState: []
        }
    }

    componentWillReceiveProps(props){
        this.retreiveActions(props)
    }
    
    retreiveActions = (props) => {
        let entityUrl = '?agent=' + props.agentName + '&intentId=' + props.intentId;
        this.props.dispatch(getIntentActions(entityUrl, rsp => {
            rsp.data.push({
                type: '',
                values: []
                })
            this.setState({actions: rsp.data, type: 'replies', values:[]})
        }, err=> {

        }))
    }

    getActions = () => {
        return this.state.actions
    };

    saveValues = (e) => {
        this.setState({
            values: [e.target.value]
        })
    };

    selectType = (value) => {
        this.setState({
            type: value
        })
    };

    getZhName = (type) => {
        let obj = typeArray.find(item => item.name == type)
        return obj.zhName
    };

    typeBlur = () => {
        this.setState({
            typeState:[]
        })
    };

    typeFocus = (index) => {
        let arr=[];
        this.state.actions.map(item => {
            arr.push(false)
        })
        arr[index] = true;
        this.setState({
            typeState: arr
        })
    };

    addAction = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if(value){
            this.setState({
                values: [value]
            });
            setTimeout(() => {
                this.updateAction(0,'new', {target:{value}})
            })
        }
    };

    getActionsType = (type,index) => {
        if (type) {
            let desc = this.getZhName(type);
            return this.state.typeState[index]? <Select defaultValue={desc} firstActiveValue={type}	 style={{ width: 120 }} onChange={this.updateAction.bind(this,index,'typeChange')} autoFocus={true} open={true} onBlur={this.typeBlur}>
                {
                    typeArray.map((item,index) => {
                        return <Option key={index} value={item.name}>{item.zhName}</Option>
                    })
                }
            </Select> : <span onClick={this.typeFocus.bind(this,index)}> {desc} </span>
        }else{
            return <Select style={{ width: 120 }} defaultValue={typeArray[0].name} onChange={this.selectType}>
                {
                    typeArray.map((item,index) => {
                        return <Option key={index} value={item.name}>{item.zhName}</Option>
                    })
                }
            </Select>
        }
    };

    getActionsContent = (values, index, record) => {
        if(record.type){
            if(record.type === 'replies' || record.type === 'api-call') {
                return <div>
                    {
                        values.map((item,i) => {
                            return (<div>
                                <span className='cell-span' key={i}>{item} <Icon onClick={this.updateAction.bind(this, index, i)} type='close'></Icon></span>
                                </div>)
                        })
                    }
                    <Input style={{width: '100%',verticalAlign: 'middle'}} onPressEnter={this.updateAction.bind(this, index, 'add')}/>
                </div>
            } else if (record.type === 'forward') {
                return <IntentSelect intentList = {this.props.intentList} value={values[0]} onChange={this.updateForwardAction.bind(this,index,'update')}/>
            }
        }else{
            if (this.state.type === 'forward') {
                return <IntentSelect intentList = {this.props.intentList} value={this.state.values[0]} onChange={this.updateForwardAction.bind(this, 0, 'new')}/>
            } else {
                return <Input style={{width: '100%',verticalAlign: 'middle'}} onBlur={this.saveValues} onPressEnter={this.addAction}/>
            }
        }
    };

    getOperators = (record, index) => {
        if(record.type){
            return (
                <Popconfirm placement="top" title="你确认要删除吗" onConfirm={this.updateAction.bind(this, index, 'delete')} okText="是" cancelText="否">
                    <Button className='button-icon' icon='delete'></Button>
                </Popconfirm>
            )
        }else{
            return <Button className='button-icon' icon='plus' onClick={this.updateAction.bind(this,0,'new')} disabled={this.state.type == ''}></Button>
        }
    };

    updateForwardAction = (index,i, value) => {
        this.updateAction(index, i, value)
    }

    updateAction = (index,i,e) => {
        this.state.actions=this.state.actions.filter(item => item.type!='');
        if (i == 'add'){
            this.state.actions[index].values.push(e.target.value);
        } else if (i == 'update'){
            this.state.actions[index].values = [e.target.value]
        } else if(i=='new'){
            if(this.state.type){
                this.state.actions.push({
                    type: this.state.type,
                    values: [e.target.value]
                });
            }else{
                message.info('请选择类型')
            }
        }else if(i=='delete'){
            this.state.actions.splice(index,1)
        }else if(i == 'typeChange'){
            this.state.actions[index].type = e
            this.typeBlur()
        }else{
            this.state.actions[index].values.splice(i,1)
        }
        if(e.target){
            e.target.value = '';
        }
        this.props.dispatch(updateIntentActions({
            agent: this.props.agentName,
            intentId: this.props.intentId,
            actions: this.state.actions
        }, data => {
            this.retreiveActions(this.props)
            }))
    };

    columns = () => {
        const that = this
        return [
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: '15%',
                render(text, record, index) {
                    return that.getActionsType(text, index)
                }
            },
            {
                title: '内容',
                dataIndex: 'values',
                key: 'values',
                render(text, record, index) {
                    return that.getActionsContent(text,index,record)
                }
            },
            {
                title: '操作',
                dataIndex: 'delete',
                key: 'delete',
                width: '10%',
                render(text, record, index) {
                    return that.getOperators(record, index)
                }
            }
        ]
    }

    render(){
        if(this.props.intentMode == "local"){
            return (<div/>)
        }

        return (<div className='table-container'>
            <p className='table-container-title'> 动作 </p>
            <Table
                dataSource={this.getActions()}
                columns={this.columns()}
                bordered
                pagination={false}
            />
        </div>)
    }
}