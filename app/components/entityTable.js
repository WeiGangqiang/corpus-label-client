import React, {Component} from 'react';
import {Icon, Row, Col, Input} from 'antd'

export class EntityTable extends Component {
    constructor(props) {
        super(props)
    }

    getCol = (item, index) => {
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
            span:{
                padding: '0px 5px',
                background: '#ccc',
                borderRadius: '2px',
                marginLeft: '5px',
                display: 'inline-block',
                lineHeight: '32px'
            },
            input:{
                width: '100px',
                marginLeft: '5px'
            }
        }
        let other = item.split(',');
        let first = other[0];
        other.shift();
        let last = other.join();
        return <Row key={item.name} style={style.contentItem}>
            <Col style={style.contentLabel} span={6}>{first}</Col>
            <Col style={style.contentInput} span={18}>
                {
                    other.map((item,i) => {
                        return <span onClick={this.deleteItem.bind(this,index,i)} style={style.span}>{item} <Icon type="close" /></span>
                    })
                }
                <Input style={style.input} onPressEnter={this.updateItem.bind(this,index)}/>
            </Col>
        </Row>
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

    }

    render() {
        const style = {
            entityContainer:{
                width: '100%',
                position: 'relative',
                padding: '40px 0 80px 0',
                borderLeft: '1px solid #dadada',
                borderTop: '1px solid #dadada',
                height: '80%'
            },
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
            header:{
                height: '40px',
                lineHeight: '40px',
                borderBottom: '1px solid #dadada',
                marginTop: '-40px',
            },
            headerItem:{
                borderRight: '1px solid #dadada',
                textAlign: 'center'
            },
            content:{
                height: '100%',
                overflow: 'auto',
                borderRight: '1px solid #dadada'
            },
            footer:{
                position: 'absolute',
                bottom: 0,
                height: '80px',
                width: '100%',
                borderBottom: '1px solid #dadada',
                borderTop: '1px solid #dadada',
                borderRight: '1px solid #dadada'
            },
            footerFirst:{
                paddingLeft: '90px',
                padding: '4px 10px'
            },
            footerFirstInput:{
                // width: '80%',
            },
            footerLast:{
                height: '40px',
                lineHeight: '40px',
                paddingLeft: '10px',
                color: '#aaa'
            }
        }

        return (
            <div style={style.entityContainer}>
                <Icon onClick={this.deleteEntity} style={style.close} type="close"></Icon>
                <Row style={style.header}>
                    <Col style={style.headerItem} span={12}>名字: {this.props.data.name}</Col>
                    <Col style={style.headerItem} span={12}>类型: 枚举</Col>
                </Row>
                <div style={style.content}>
                    {
                        this.props.data.items && this.props.data.items.map((item,index) => {
                            return this.getCol(item, index)
                        })
                    }
                </div>
               <Row style={style.footer}>
                   <Col style={style.footerFirst}>
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