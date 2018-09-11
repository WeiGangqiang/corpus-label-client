import React, {Component} from 'react';
import { Table , Icon, Input, Select, Button, message, Popconfirm} from 'antd'

const Option = Select.Option;

export class EntityParameters extends Component {
    constructor(props) {
        super(props)
        this.state={
            entity: '',
            name: '',
            nameEditArray: [],
            entityEditArray: []
        }
    }

    showMoreValues(i) {
        this.props.showMoreValues(i)
    }

    showLessValues(i) {
        this.props.showLessValues(i)
    }

    handleChange = (value) => {
        this.setState({
            entity: value
        })
    };

    handleEntityChange = (item,value) => {
        this.setState({
            entityEditArray: []
        });
        let {name, label, entity} = item;
        entity = value;

        this.props.putIntentParameterEntity({
            "intentId": this.props.intentId,
            "parameter": {name,label,entity}
        },{intentId: this.props.intentId, mode: this.props.mode})
    };

    blur = () => {
        this.setState({
            entityEditArray: []
        });
    };

    inputName = (e) => {
        this.setState({
            name: e.target.value
        })
    };

    addItems = () => {
        let flag = true;

        this.props.entityParam.map(item => {
            if(item.name == this.state.name){
                flag = false
            }
        });
        if(flag){
            this.props.addIntentParameter({
                "intentId": this.props.intentId,
                "parameter": {
                    name: this.state.name,
                    entity: this.state.entity
                }
            }, {intentId:this.props.intentId,mode: this.props.mode})
        }else{
            message.info('变量名重复请重新填写')
        }
    };

    deleteItems = (item) => {
        if (this.props.intentId && this.state.mode != 'local'){
            const {name, label, entity} = item;
            this.props.deleteIntentParameter({
                    "intentId": this.props.intentId,
                    "parameter": {name,label,entity}
            },{
                name: this.props.name,
                zhName: this.props.zhName,
                modelPath: this.props.modelPath,
                intentId: this.props.intentId,
                mode: this.props.mode
            })
        }else{
            message.info('不允许删除该变量')
        }
    };

    updateName = (item, index, e) => {
        this.setState({
            nameEditArray: []
        });
        let {name, label, entity} = item;
        name = e.target.value;
        this.props.putIntentParameter({
            "intentId": this.props.intentId,
            "parameter": {name,label,entity}
        },{intentId: this.props.intentId, mode: this.props.mode})
    };

    getEntity = () => {

    };

    changeInput = (index) => {
        let arr = [];
        this.props.entityParam.map(item => {
            arr.push(false);
        });
        arr.splice(index,1,true);
        this.setState({
            nameEditArray: arr
        })
    };

    changeSelected = (index) => {
        let arr = [];
        this.props.entityParam.map(item => {
            arr.push(false);
        });
        arr.splice(index,1,true);
        this.setState({
            entityEditArray: arr
        })
    };

    _renderDeleteButton (record) {
        return (
            <Popconfirm placement="top" title="你确认要删除吗" onConfirm={this.deleteItems.bind(this,record)} okText="是" cancelText="否">
                <Button className='button-icon' icon='delete'></Button>
            </Popconfirm>
        )
    } 

    columns = () => {
        const that = this

        return [
            {
                title: '变量名',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                render(text, record, index) {
                    if(record.entity){
                        return that.state.nameEditArray[index] ? <input className='inputOrigin' placeholder={text} defaultValue={record.name} onBlur={that.updateName.bind(that, record,index)}/> : <span style={{display: 'block'}} onClick={that.changeInput.bind(that,index)}>{record.name}</span>}
                    else{
                        return <Input className='bb' defaultValue='' onInput={that.inputName}/>
                    }
                }
            },
            {
                title: '实体名',
                dataIndex: 'entity',
                key: 'entity',
                width: '15%',
                render(text, record, index) {
                    if(text){
                        return that.state.entityEditArray[index] ? <Select className='testAA' defaultValue={text} firstActiveValue={text} style={{ width: 120 }} onChange={that.handleEntityChange.bind(that,record)} onBlur={that.blur} open={true} autoFocus={true}>
                            {
                                that.props.entityList.map(item => {
                                    return <Option key={item.entityId} value={item.key}>{item.key}</Option>
                                })
                            }
                        </Select> : <span onClick={that.changeSelected.bind(that,index)} className='corpusSpan' style={{background: record.color}}>{text}</span>
                    }else{
                        return <Select className='testAA' defaultValue="" style={{ width: 120 }} onChange={that.handleChange}>
                            {
                                that.props.entityList.map(item => {
                                    return <Option key={item.entityId} value={item.key}>{item.key}</Option>
                                })
                            }
                        </Select>
                    }
                }
            },
            {
                title: '槽位值',
                dataIndex: 'valuesShow',
                key: 'valuesShow',
                width: '60%',
                render(text, record, index) {
                    return <span> {text.join()} </span>
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width: '10%',
                render(text, record, index) {
                    if(record.entity){
                        if(record.values.length <= 10){
                            return (<div>
                                    {that._renderDeleteButton(record)}
                                </div>)
                        } else if(record.valuesShow.length <= 10){
                            console.log(record);
                            return ( <div>
                                {that._renderDeleteButton(record)}
                                <Button className='button-icon' icon='down' onClick={that.showMoreValues.bind(that, index)}/>
                            </div>)
                        } else {
                            return (<div>
                                {that._renderDeleteButton(record)}
                                <Button className='button-icon' icon='up' onClick={that.showLessValues.bind(that, index)}/>
                            </div>)
                        }
                    }else{
                        return <Button className='button-icon' icon='plus' onClick={that.addItems} disabled={that.state.entity=='' || that.state.name==''}></Button>
                        // return <Button disabled={true}>增加</Button>
                    }
                }
            }
        ]
    }

    render() {
        return (
            <div className="table-container">
                <p className='table-container-title'> 槽位信息 </p>
                <Table
                    dataSource={this.props.entityParam}
                    columns={this.columns()}
                    bordered
                    pagination={false}
                />
            </div>
        )
    }
}