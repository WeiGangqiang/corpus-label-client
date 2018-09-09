import React, {Component} from 'react';
import {Icon, Row, Col, Input, Table, message, Button} from 'antd'
import {IntentDesc} from 'components/index'

export class EntityTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newWord: '',
            newPhrase: '',
            wordState: []
        }
    }

    newWord = (e) => {
        this.setState({
            newWord: e.target.value
        });
    };

    newPhrase = (e) => {
        this.setState({
            newPhrase: e.target.value
        });
    };

    addItem = (e) => {
        if(this.props.data.mode!='local'){
            if(this.state.newWord){
                let item = this.state.newPhrase ? this.state.newWord + ',' + this.state.newPhrase.replace(/，/g,',') : this.state.newWord;
                this.props.data.items = this.props.data.items.filter(item => item!='');
                this.props.updateEntity({
                    name: this.props.data.name,
                    entityId: this.props.data.entityId,
                    items: [...this.props.data.items, item]
                })
            }else{
                message.info('词条名不能为空')
            }
        }else {
            message.info('该实体不允许更新')
        }


    }

    updateItem = (index, e) => {
        if(this.props.data.mode!='local'){
            this.props.data.items = this.props.data.items.filter(item => item!='');
            this.props.data.items[index] = this.props.data.items[index] + ',' + e.target.value.replace(/，/g, ',');
            this.props.updateEntity({
                name: this.props.data.name,
                entityId: this.props.data.entityId,
                items: this.props.data.items
            })
            e.target.value = ''
        }else {
            message.info('该实体不允许更新')
        }
    }

    deleteEntity = () => {
        if(this.props.data.mode!='local'){
            if(this.props.entityRefrence.length){
                message.info('该实体有多处引用，不允许删除')
            }else{
                this.props.deleteEntity(this.props.data)
            }
        }else{
            message.info('该实体不允许删除')
        }
    };

    showInput = (index) => {
        let arr = [];
        this.props.data.items && this.props.data.items.map(item => {
            arr.push(false)
        });
        arr[index] = true;
        this.setState({
            wordState: arr
        });
    };

    changeWord = (index,e) => {
        this.setState({
            wordState: []
        });
        if(this.props.data.mode!='local'){
            this.props.data.items = this.props.data.items.filter(item => item!='');
            var arr = this.props.data.items[index].split(',')
            arr[0] = e.target.value;
            this.props.data.items[index] = arr.join()
            this.props.updateEntity({
                name: this.props.data.name,
                entityId: this.props.data.entityId,
                items: this.props.data.items
            })
        }else {
            message.info('该实体不允许更新')
        }
    };

    deleteItem = (index,i) => {
        if(this.props.data.mode!='local'){
            this.props.data.items = this.props.data.items.filter(item => item!='');
            var arr = this.props.data.items[index].split(',');
            arr.splice(i+1,1)
            this.props.data.items[index] = arr.join()
            this.props.updateEntity({
                name: this.props.data.name,
                entityId: this.props.data.entityId,
                items: this.props.data.items
            })
        }else {
            message.info('该实体不允许更新')
        }

    };

    deleteItems = (index) => {
        if(this.props.data.mode!='local'){
            this.props.data.items = this.props.data.items.filter(item => item!='');
            this.props.data.items.splice(index,1);
            this.props.updateEntity({
                name: this.props.data.name,
                entityId: this.props.data.entityId,
                items: this.props.data.items
            })
        }else {
            message.info('该实体不允许更新')
        }

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
                    if(record){
                        return that.state.wordState[index] ? <Input defaultValue={record.split(',')[0]} placeholder='词条名' autoFocus={true} onPressEnter={that.changeWord.bind(that,index)} onBlur={that.changeWord.bind(that,index)}/> : <span onClick={that.showInput.bind(that,index)}>{record.split(',')[0]}</span>
                    }else{
                        return <Input placeholder='词条名' onBlur={that.newWord}/>
                    }
                }
            },
            {
                title: '近义词',
                dataIndex: 'phrase',
                key: 'phrase',
                width: '70%',
                className: 'tableIndex',
                render(text, record, index) {
                    if(record){
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
                    }else{
                        return <Input placeholder='输入近义词' onBlur={that.newPhrase}/>
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'todo',
                key: 'todo',
                width: '10%',
                className: '',
                render(text, record, index) {
                    if(record){
                        return <div><Icon onClick={that.deleteItems.bind(that,index)} type="delete"/></div>
                    }else{
                        return <div><Icon type="plus" onClick={that.addItem}/></div>
                    }
                }
            }
        ]
    };
    columnsRefrence = () => {
        return [
            {
                title: '意图名',
                dataIndex: 'intent',
                key: 'intent',
                width: '30%',
                className: 'tableIndex',
            },
            {
                title: '意图中文名',
                dataIndex: 'zhName',
                key: 'zhName',
                width: '30%',
                className: 'tableIndex'
            },
            {
                title: '变量名',
                dataIndex: 'para',
                key: 'para',
                width: '40%',
                className: 'tableIndex'
            }
        ]

    };

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
        };

        return (
            <div className="entity-table-container">
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
                    scroll={{x:600}}
                ></Table>

               <div>
                   <Button style={{display: 'block',width: '100%', margin: '10px 0'}} type="primary" onClick={this.deleteEntity}>删除实体</Button>
                   <span>实体的引用</span>
                   <Table
                       dataSource={this.props.entityRefrence}
                       columns={this.columnsRefrence()}
                       bordered
                       pagination={false}
                       scroll={{x:600}}
                   >
                   </Table>
               </div>
            </div>
        )
    }
}