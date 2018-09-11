import React, {Component} from 'react';
import {Icon, Row, Col, Input, Table, message, Button, Popconfirm} from 'antd'
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

    getTitle = () => {

        return <p style={subtitleCss}> 近义词列表 </p>
    };
    
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


    };

    addWord = (e) => {
        const name = e.target.value.replace(/\s/g, '');
        if(this.props.data.mode != 'local'){
            if(name){
                let item = this.state.newPhrase ? name + ',' + this.state.newPhrase.replace(/，/g,',') : name;
                this.props.data.items = this.props.data.items.filter(item => item!='');
                this.props.updateEntity({
                    name: this.props.data.name,
                    entityId: this.props.data.entityId,
                    items: [...this.props.data.items, item]
                })
            }
        }else{
            message.info('该实体mode值为local，不允许操作')
        }
    };

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
                padding: '5px 11px',
                background: '#bae7ff',
                borderRadius: '5px',
                marginLeft: '5px',
                display: 'inline-block',
                lineHeight: '22px',
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
                        return <Input placeholder='词条名' onInput={that.newWord} onPressEnter={that.addWord}/>
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
                        return <Input placeholder='输入近义词' onInput={that.newPhrase}/>
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
                        return  (
                        <div>
                            <Popconfirm placement="top" title="你确认要删除吗" onConfirm={that.deleteItems.bind(that,index)} 
                                okText="是" cancelText="否">
                                <Button className='button-icon' icon='delete'/>
                            </Popconfirm>
                        </div>
                    )
                    }else{
                        return <div><Button disabled={that.state.newWord == ''} className='button-icon' icon='plus' onClick={that.addItem}></Button></div>
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
            <div>
                <div className="entity-table-container table-container">
                    <span className="table-container-title">近义词列表</span>
                    <Table
                        dataSource={this.props.data.items && this.props.data.items}
                        columns={this.columns()}
                        bordered
                        pagination={false}
                        scroll={{x:600}}
                    ></Table>
                </div>
                <div className="entity-table-container table-container">
                    <span className="table-container-title">实体的引用</span>
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