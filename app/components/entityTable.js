import React, {Component} from 'react';
import {Icon, Row, Col, Input, Table} from 'antd'
import {IntentDesc} from 'components/index'

export class EntityTable extends Component {
    constructor(props) {
        super(props)
    }

    addItem = (e) => {
        this.props.addItem({
            name: this.props.data.name,
            entityId: this.props.data.entityId,
            items: this.props.data.items ? [...this.props.data.items, e.target.value.replace(/，/g,',')] : [e.target.value.replace(/，/g,',')]
        })
        e.target.value = ''
    }

    updateItem = (index, e) => {
        this.props.data.items[index] = this.props.data.items[index] + ',' + e.target.value.replace(/，/g, ',')
        this.props.addItem({
            name: this.props.data.name,
            entityId: this.props.data.entityId,
            items: this.props.data.items
        })
        e.target.value = ''
    }

    deleteEntity = () => {
        this.props.deleteEntity(this.props.data)
    }

    deleteItem = (index,i) => {
        var arr = this.props.data.items[index].split(',')
        arr.splice(i+1,1)
        this.props.data.items[index] = arr.join()
        this.props.delItem({
            name: this.props.data.name,
            entityId: this.props.data.entityId,
            items: this.props.data.items
        })

    };

    columns = () => {
        const style = {
            contentItem:{
                borderBottom: '1px solid #dadada'
            },
            contentLabel:{
                textAlign: 'center',
                lineHeight: '40px'
            },
            contentInput:{
                lineHeight: '40px',
                padding: '0 10px',
                borderLeft: '1px solid #dadada'
            },
            close:{
                cursor: 'pointer'
            },
            span:{
                padding: '0px 5px',
                background: '#bae7ff',
                borderRadius: '2px',
                marginLeft: '5px',
                display: 'inline-block',
                lineHeight: '32px',
                marginTop: '5px',
            },
            input:{
                width: '120px',
                marginLeft: '5px',
                marginTop: '5px',
            }
        }
        const that = this
        return [
            {
                title: '词条',
                dataIndex: 'word',
                key: 'word',
                width: '20%',
                className: 'tableIndex',
                render(text, record, index) {
                    return <span>{record.split(',')[0]}</span>
                }
            },
            {
                title: '近义词',
                dataIndex: 'phrase',
                key: 'phrase',
                width: '80%',
                className: 'tableIndex',
                render(text, record, index) {
                    let other = record.split(',');
                    other.shift();
                    return <block>
                        {
                            other.map((item,i) => {
                                return <span onClick={that.deleteItem.bind(that,index,i)} style={style.span}>{item} <Icon type="close" style={style.close}/></span>
                            })
                        }
                        <Input placeholder='请输入近义词' style={style.input} onPressEnter={that.updateItem.bind(that,index)}/>
                    </block>
                }
            }
        ]
    }

    render() {
        const style = {
            close:{
                position: 'absolute',
                right: '0',
                top: '0',
                width: '20px',
                height: '20px',
                lineHeight: '20px',
                background: '#ddd',
                cursor: 'pointer',
                zIndex: 1
            },
            footerFirstInput:{
                // width: '80%',
            },
            footerLast:{
                height: '40px',
                lineHeight: '40px',
                paddingLeft: '10px',
                color: '#aaa'
            },
            baseInfo: {
                height: 'auto',
                background: '#fbfbfb',
                padding: '0 15px',
                fontSize: '14px',
                marginBottom: '30px',
                borderRadius: '15px'
            },
            col: {
                lineHeight: '40px',
                paddingLeft: '70px'
            },
            span: {
                float: 'left',
                width: '70px',
                marginLeft: '-70px'
            },
        }

        return (
            <div className="entity-table-container">
                <Icon onClick={this.deleteEntity} style={style.close} type="close"></Icon>

                <Row style={style.baseInfo}>
                    <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                        <span style={style.span}>名字:</span>
                        <div>{this.props.data.name}</div>
                    </Col>
                    <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                        <span style={style.span}>中文名字:</span>
                        <div>{this.props.data.zhName}</div>
                    </Col>
                    <Col style={style.col} span={4} xs={24} sm={12} xl={4}>
                        <span style={style.span}>类型:</span>
                        <div>枚举</div>
                    </Col>
                </Row>

                <Table
                    dataSource={this.props.data.items && this.props.data.items}
                    columns={this.columns()}
                    bordered
                    pagination={false}
                ></Table>
               <Row style={{marginTop: '30px'}}>
                   <Col>
                       <Input style={style.footerFirstInput} onPressEnter={this.addItem} addonBefore={<div>新增实体</div>}/>
                   </Col>
                   <Col style={style.footerLast}>
                       填写多个词语的时候，中间用逗号隔开
                   </Col>
               </Row>
            </div>
        )
    }
}