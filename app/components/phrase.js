import React, {Component} from 'react'
import {connect} from 'react-redux'
import {putPhrase, deletePhrase} from 'actions/intend'
import {Table,Form,Button,Input,Icon} from 'antd'


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
            phrase: {}
        }
    }

    delPhraseText(item, i) {
        item.similars.splice(i, 1)
        this.props.dispatch(putPhrase({
            ...item,
            intent: this.props.name,
            agent: this.props.agent
        }, data => {
            this.props.updatePhraseArray()
        }))
    }

    showAddPhrase(phrase) {
        this.setState({
            showModalFlag: true,
            phrase: {...phrase}
        })
    }

    hideAddPhrase() {
        this.setState({
            showModalFlag: false,
            phraseText: '',
            phrase: {}
        })
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

    }

    addPhraseText(phrase, e) { 
        console.log('get phrase test', e.target.value)
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

    }

    getTitle = () => {
        const subtitleCss = {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '0px',
            lineHeight: '40px'
        }
        return <p style={subtitleCss}> 近义词列表 </p>
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
                            <Input placeholder="请输入" type="text" key={that.state.inputKey}
                                onPressEnter={that.addPhraseText.bind(that, record)}
                            />
                        </div>
                    </div>
                }
            },
            {
                title: '操作',
                dataIndex: 'delete',
                key: 'delete',
                render(text, record, index) {
                    return <Button onClick={that.delPhraseItem.bind(that, record)}>删除</Button>
                }
            }
        ]
    }

    render() {
        const style = {
            phraseContainer: {
                marginTop: '15px',
                background: '#fbfbfb',
                borderRadius: '15px',
                padding: '10px 15px',
                marginBottom: '50px',
            },

            tableBox: {
                marginBottom: '20px'
            }
        }
        return (
            <div style={style.phraseContainer}>
                {this.getTitle()}
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