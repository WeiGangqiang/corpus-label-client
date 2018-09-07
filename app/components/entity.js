import React, {Component} from 'react';
import { Table , Icon, Input, Select, Button, message} from 'antd'

const Option = Select.Option;

export class EntityParameters extends Component {
    constructor(props) {
        super(props)
        this.state={
            entity: '',
            name: ''
        }
    }

    showMoreValues(i) {
        this.props.showMoreValues(i)
    }

    showLessValues(i) {
        this.props.showLessValues(i)
    }

    getTitle = () => {
        const subtitleCss = {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '0px',
            lineHeight: '40px',
        }
        return <p style={subtitleCss}> 槽位信息 </p>
    };

    handleChange = (value) => {
        this.setState({
            entity: value
        })
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
            })
        }else{
            message.info('不允许删除该变量')
        }
    };

    updateName = (item, e) => {
        let {name, label, entity} = item;
        name = e.target.value;
        this.props.putIntentParameter({
            "intentId": this.props.intentId,
            "parameter": {name,label,entity}
        },{intentId: this.props.intentId, mode: this.props.mode})
    };

    getEntity = () => {

    };

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
                        return <input className='inputOrigin' placeholder={text} defaultValue={record.name} onBlur={that.updateName.bind(that, record)}/>}
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
                        return <span className='corpusSpan' style={{background: record.color}}>{text}</span>
                    }else{
                        return <Select defaultValue="" style={{ width: 120 }} onChange={that.handleChange}>
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
                key: 'oparete',
                width: '10%',
                render(text, record, index) {
                    if(record.entity){
                        if(record.values.length < 10){
                            return (<div><Icon onClick={that.deleteItems.bind(that,record)} type="delete"/></div>)
                        } else if(record.valuesShow.length <= 10){
                            return ( <div><span style={{paddingLeft: '10px', color:'#0099CC'}} onClick={that.showMoreValues.bind(that, index)}>详情 <Icon type='caret-down'/></span><Icon onClick={that.deleteItems.bind(that,record.entity)} type="delete"/></div>)
                        } else {
                            return (<div><span style={{paddingLeft: '10px', color:'#0099CC'}}  onClick={that.showLessValues.bind(that, index)}>简要 <Icon type='caret-up'/></span><Icon onClick={that.deleteItems.bind(that,record.entity)} type="delete"/></div>)
                        }
                    }else{
                        return <Button onClick={that.addItems} disabled={that.state.entity=='' || that.state.name==''}>增加</Button>
                        // return <Button disabled={true}>增加</Button>
                    }
                }
            }
        ]
    }

    render() {
        const style = {
            entityContainer: {
                marginTop: '15px',
                background: '#fbfbfb',
                borderRadius: '15px',
                marginBottom: '15px',
                padding: '0 15px',
                paddingEnd: '10px'
            }
        };
        return (
            <div style={style.entityContainer}>
                {this.getTitle()}
                <Table
                    dataSource={this.props.entityParam}
                    columns={this.columns()}
                    bordered
                    pagination={false}
                />
                <div>

                </div>
                <div style={{ height: '10px' }}> </div>
            </div>

        )
    }
}