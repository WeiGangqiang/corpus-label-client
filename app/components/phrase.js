import React, {Component} from 'react'
import {connect} from 'react-redux'
import {putPhrase, deletePhrase, postPhrase, patternsSync} from 'actions/intent'
import {Table,Form,Button,Input,Icon,Popconfirm} from 'antd'


const FormItem = Form.Item

@connect((state, props) => ({
}))
@Form.create({
    onFieldsChange(props, items) {
    },
})
export class PhraseList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModalFlag: false,
            inputKey: 0,
            phrase: {},
            focusIndex: 0
        }
    }

    delPhraseText(item, i) {
        let phrase = item.similars[i]
        this.props.dispatch(patternsSync({
            phrase   : phrase,
            phraseId : item.phraseId,
            intentId : item.intentId,
            intent   : this.props.intent,
            agent    : this.props.agent
        }, data => {
            this.props.reloadPatterns()
        }))

        item.similars.splice(i, 1)
        if (item.similars.length == 0) {
            this.props.dispatch(deletePhrase({
                phraseId: item.phraseId,
                intentId: item.intentId,
                intent: this.props.intent,
                agent: this.props.agent
            }, data => {
                this.props.updatePhraseArray()
            }))
        } else {
            this.props.dispatch(putPhrase({
                ...item,
                intent: this.props.name,
                agent: this.props.agent
            }, data => {
                this.props.updatePhraseArray()
            }))
        }
    }

    delPhraseItem(phrase) {
        this.props.dispatch(deletePhrase({
            phraseId: phrase.phraseId,
            intentId: phrase.intentId,
            intent: this.props.intent,
            agent: this.props.agent
        }, data => {
            this.props.updatePhraseArray()
        }))

        this.props.dispatch(patternsSync({
            phrase   : '',
            phraseId : phrase.phraseId,
            intentId : phrase.intentId,
            intent   : this.props.intent,
            agent    : this.props.agent
        }, data => {
            this.props.reloadPatterns()
        }))

    }

    addPhraseText(phrase, index, e) {
        this.setState({
            focusIndex: index
        })
        if(phrase.intentId){
            this.setState({inputKey: this.state.inputKey + 1})
            const phraseText = e.target.value.replace(/，/g, ',').split(',');
            phrase.similars = phrase.similars.concat(phraseText)
            this.props.dispatch(putPhrase({
                ...phrase,
                intent: this.props.intent,
                agent: this.props.agent
            }, data => {
                this.props.updatePhraseArray()
            }));
        }else{
            this.props.dispatch(postPhrase({
                similars: e.target.value.replace('，',',').split(','),
                intentId: this.props.intentId,
                intent: this.props.intent,
                agent: this.props.agent
            }, data => {
                this.props.updatePhraseArray()
            },error => {
                console.log(error)
            }))
            e.target.value = ''
        }
    }

    _renderDeleteButton (record) {
        return (
            <Popconfirm placement="top" title="你确认要删除吗" onConfirm={this.delPhraseItem.bind(this, record)}
                okText="是" cancelText="否">
                <Button className='button-icon' icon='delete'/>
            </Popconfirm>
        )
    }

    columns = () => {
        const style = {
            phrase:{
                display:'inline-block',
                border: '1px solid #dadada',
                margin:'7px 15px 7px 0',
                padding:'5px 10px'
            },
            input:{
                display:'inline-block',
            },
            delete:{
                marginLeft: '5px'
            }

        }
        const that = this
        return [
            {
                title: '序号',
                dataIndex: 'phraseId',
                key: 'phraseId',
                width: '10%',
                className: 'tableIndex',
                render(text, record, index) {
                    return <span className='corpusSpan' style={{background: record.color}}>{index+1}</span>
                }
            },
            {
                title: '近义词值',
                dataIndex: 'name',
                key: 'name',
                className: 'phraseWord',
                render(text, record, index) {
                    return <div>
                        {
                            record.similars.map((item,i) => {
                                return <div style={style.phrase} key={i}>{item}<Icon style={style.delete} onClick={that.delPhraseText.bind(that, record, i)} type="close"/></div>
                            })
                        }
                        <div style={style.input} >
                            {
                                that.state.focusIndex == index ? <Input  placeholder="请输入" type="text" key={that.state.inputKey}
                                onPressEnter={that.addPhraseText.bind(that, record, index)} autoFocus
                                /> :  <Input placeholder="请输入" type="text" key={that.state.inputKey}
                                             onPressEnter={that.addPhraseText.bind(that, record, index)}
                                />
                            }
                        </div>
                    </div>
                }
            },
            {
                title: '操作',
                dataIndex: 'delete',
                key: 'delete',
                width: '10%',
                render(text, record, index) {
                    if (record.intentId) {
                        return that._renderDeleteButton(record)
                    } else {
                        return <Button className='button-icon' icon='plus' disabled></Button>
                    }
                }
            }
        ]
    }

    render() {
        const style = {

            tableBox: {
                marginBottom: '20px'
            },

            plus:{
                height: '40px',
                lineHeight: '40px',
                border: '1px solid #dadada',
                borderTop: 'none',
                cursor: 'pointer'
            },
            plusDiv:{
                width: '10%',
                textAlign: 'center',
                display: 'inline-block',
                borderRight: '1px solid #dadada'
            },
            plusDivSpan:{
                padding: '5px 10px',
                borderRadius:'3px',
                background: 'green',
                fontSize: '14px',
                color: '#fff'
            },
            plusInputDiv:{
                display: 'inline-block',
                paddingLeft: '5px'
            }
        }
        return (
            <div className="table-container">
                <p className="table-container-title"> 近义词列表 </p>
                <Table
                    dataSource={this.props.phraseArray}
                    columns={this.columns()}
                    bordered
                    pagination={false}
                />
                <div style = {{height: '10px'}}> </div>
            </div>)

    }
}
