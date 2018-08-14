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
            phraseText: '',
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

    getPhraseText(e) {
        this.setState({
            phraseText: e.target.value
        })
        e.target.value = ''
    }

    addPhraseText(phrase) {
        const phraseText = this.state.phraseText.replace(/，/g, ',').split(',');
        phrase.similars = phrase.similars.concat(phraseText)
        this.props.dispatch(putPhrase({
            ...phrase,
            intent: this.props.intent,
            agent: this.props.agent
        }, data => {
            // this.hideAddPhrase()
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
        const {getFieldDecorator} = this.props.form
        const that = this
        return [
            {
                title: '近义词类名',
                dataIndex: 'phraseId',
                key: 'phraseId',
                render(text, record, index) {
                    return <span className='corpusSpan' style={{background: record.color}}>{record.similars[0]}</span>
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
                                return <div style={{display:'inline-block',border: '1px solid #dadada',margin:'7px 15px 7px 0',padding:'5px 10px'}} key={i}>{item}<Icon
                                    onClick={that.delPhraseText.bind(that, record, i)} type="close"/></div>
                            })
                        }
                    </div>
                }
            },
            {
                title: '添加',
                dataIndex: 'add',
                key: 'add',
                render(text, record, index) {
                    return <div style={{paddingRight: '80px'}}>
                        <Input
                            placeholder="请输入近义词"
                            type="text"
                            onBlur={that.getPhraseText.bind(that)}
                        />
                        <Button style={{float:'right',marginRight: '-80px'}} onClick={that.addPhraseText.bind(that, record)}>添加</Button>
                        </div>
                }
            },
            {
                title: '删除',
                dataIndex: 'delete',
                key: 'delete',
                render(text, record, index) {
                    return <Button onClick={that.delPhraseItem.bind(that, record)}>删除</Button>
                }
            }
        ]
    }

    render() {

        const {getFieldDecorator} = this.props.form
        const style = {
            phraseContainer: {
                marginTop: '15px',
                background: '#fbfbfb',
                borderRadius: '15px',
                padding: '0 15px'
            },
            serveLi: {
                padding: '5px 0px',
                fontSize: '14px',
            },
            serveLiSpan: {
                marginRight: '15px',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'inline-block',
                marginBottom: '15px'
            },
            phraseItem: {
                background: '#fbfbfb',
                borderBottom: '1px solid green'
            },
            phraseText: {
                display: 'inline-block',
                padding: '5px 10px',
                margin: '7px 15px 7px 0',
                background: 'green',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '3px'
            },
            phraseBox: {
                background: '#fbfbfb',
                width: '100%',
                height: '100%',
                borderRadius: '15px'
            }
        }
        return (
            <div style={style.phraseContainer}>
                {this.getTitle()}
                {/*<ul style={style.phraseBox}>*/}
                    {/*{this.props.phraseArray.map((phrase, index) => {*/}
                        {/*return <li key={index}*/}
                                   {/*style={{...style.phraseItem, background: index % 2 === 0 ? '#fbfbfb' : '#fff'}}>*/}
                            {/*<div style={style.phraseText}>{phrase.phraseId}</div>*/}
                            {/*{*/}
                                {/*phrase.similars.map((item, i) => {*/}
                                    {/*return <div style={style.phraseText} key={i}>{item}<Icon*/}
                                        {/*onClick={this.delPhraseText.bind(this, phrase, i)} type="close"/></div>*/}
                                {/*})*/}
                            {/*}*/}
                            {/*<div onClick={this.showAddPhrase.bind(this, phrase)} style={style.phraseText}>添加</div>*/}
                            {/*<div onClick={this.delPhraseItem.bind(this, phrase)} style={style.phraseText}>删除</div>*/}
                        {/*</li>*/}
                    {/*})}*/}
                {/*</ul>*/}
                {/*<Modal*/}
                    {/*title="添加近义词"*/}
                    {/*centered*/}
                    {/*visible={this.state.showModalFlag}*/}
                    {/*onOk={() => this.addPhraseText()}*/}
                    {/*onCancel={() => this.hideAddPhrase()}*/}
                    {/*destroyOnClose={true}*/}
                {/*>*/}
                    {/*<Input onBlur={this.getPhraseText.bind(this)}></Input>*/}
                    {/*<span>如果添加多个中间用逗号隔开，如：漂亮，美丽</span>*/}
                {/*</Modal>*/}

                <Table
                    dataSource={this.props.phraseArray}
                    columns={this.columns()}
                    bordered
                    pagination={false}
                />

            </div>)

    }
}