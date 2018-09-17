import React, {Component} from 'react';
import { Table , Icon, Input, Select, Button, message, Popconfirm, Tooltip, Checkbox} from 'antd'

import {InputValidate} from 'components/index'

const Option = Select.Option;

export class EntityParameters extends Component {
    constructor(props) {
        super(props)
        this.state={
            entity: '',
            name: '',
            prompt: [],
            nameEditArray: [],
            entityEditArray: []
        }
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
        
        entity = value;
        this.updateValue(item, {entity: value})
    };

    blur = () => {
        this.setState({
            entityEditArray: []
        });
    };

    inputName = (value) => {
        this.setState({
            name: value
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
                mode: this.props.mode,
                label: label
            })
        }else{
            message.info('不允许删除该变量')
        }
    };

    updateName = (item, index, e) => {
        this.setState({
            nameEditArray: []
        });
        this.updateName(item, {name: e.target.value})
    };

    updateRequire = (item, e) => {
        let {name, label, entity, require, prompt} = item;
        this.props.updateIntentRequire({
            "intentId": this.props.intentId,
            "parameter": {name, label, entity, require, prompt, ...{require: e.target.checked}}
        },{intentId: this.props.intentId, mode: this.props.mode, label: label, require: e.target.checked})
    }

    updateValue = (item, value) => {
        let {name, label, entity, require, prompt} = item
        this.props.putIntentParameter({
            "intentId": this.props.intentId,
            "parameter": {name, label, entity, require, prompt, ...value}
        },{intentId: this.props.intentId, mode: this.props.mode, label: label})
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

    deletePrompt (record, index,  promptIdx) {
        let prompt = [...record.prompt]
        prompt.splice(promptIdx, 1)
        this.updateValue(record, {prompt})
    }

    addPrompt (record, event) {
        let prompt = [...record.prompt, event.target.value]
        event.target.value = ''
        this.updateValue(record, {prompt})
    }

    columns = () => {
        const that = this
        return [
            {
                title: '必选',
                dataIndex: 'require',
                key: 'require',
                width: '2%',
                render(require, record, index) {
                    if (record.entity) {
                        return (
                            <div style={{width: '100%', textAlign:'center'}}>
                                <Checkbox checked={require} onChange={that.updateRequire.bind(that, record)}></Checkbox>
                            </div>
                        )    
                    }   
                }
            },            
            {
                title: '变量名',
                dataIndex: 'name',
                key: 'name',
                width: '10%',
                render(text, record, index) {
                    if(record.entity){
                        return that.state.nameEditArray[index] ? <input className='inputOrigin' placeholder={text} defaultValue={record.name} onBlur={that.updateName.bind(that, record,index)}/> : <span style={{display: 'block'}} onClick={that.changeInput.bind(that,index)}>{record.name}</span>}
                    else{
                        // return <Input className='bb' defaultValue='' onInput={that.inputName}/>
                        return <InputValidate setName={that.inputName}/>
                    }
                }
            },
            {
                title: '实体名',
                dataIndex: 'entity',
                key: 'entity',
                width: '10%',
                render(text, record, index) {
                    if(text){
                        return that.state.entityEditArray[index] ? <Select className='testAA' defaultValue={text} firstActiveValue={text} style={{ width: 120 }} onChange={that.handleEntityChange.bind(that,record)} onBlur={that.blur} open={true} autoFocus={true}>
                            {
                                that.props.entityList.map(item => {
                                    return <Option key={item.entityId} value={item.key}>{item.key}</Option>
                                })
                            }
                        </Select> : (
                            <Tooltip placement="topLeft" title={record.valuesShow.join(',')} arrowPointAtCenter>
                                <span onClick={that.changeSelected.bind(that,index)} className='corpusSpan' style={{background: record.color}}>{text}</span>
                            </Tooltip>
                        )
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
                title: '追问',
                dataIndex: 'prompt',
                key: 'prompt',
                width: '30%',
                render(prompt, record, index) {
                    if(record.entity && record.require) {
                        return <div>
                            {
                                prompt.map((item,i) => {
                                    return (<div>
                                        <span className='cell-span' key={i}>{item} <Icon onClick={that.deletePrompt.bind(that, record, index, i)} type='close'></Icon></span>
                                        </div>)
                                })
                            }
                            <Input style={{width: '100%',verticalAlign: 'middle'}} onPressEnter={that.addPrompt.bind(that, record)}/>
                        </div>
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                width: '5%',
                render(text, record, index) {
                    if(record.entity){
                        return (<div>
                                {that._renderDeleteButton(record)}
                            </div>)
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
                    scroll={{x:700}}
                />
            </div>
        )
    }
}