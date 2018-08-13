import React, { Component } from 'react'
import { connect } from 'react-redux'
import { putPhrase, deletePhrase } from 'actions/intend'
import { Icon, Input, Modal } from 'antd'


@connect((state, dispatch) => ({
}))
export class PhraseList extends Component {
  constructor(props){
    super(props)
    this.state={
      showModalFlag: false,
      phraseText: '',
      phrase: {}
    }
  }

  delPhraseText(item, i) {
    item.similars.splice(i,1)
    this.props.dispatch(putPhrase({
      ...item,
      intent: this.props.name,
      agent: this.props.agent
    },data=>{
      this.props.updatePhraseArray()
    }))
  }

  showAddPhrase(phrase){
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
    },data=>{
      this.props.updatePhraseArray()
    }))

  }

  getPhraseText(e) {
    this.setState({
      phraseText: e.target.value
    })
  }

  addPhraseText() {
    const phraseText = this.state.phraseText.replace('，',',').split(',');
    this.state.phrase.similars = this.state.phrase.similars.concat(phraseText)
    this.props.dispatch(putPhrase({
      ...this.state.phrase,
      intent: this.props.intent,
      agent: this.props.agent
    },data=>{
      this.hideAddPhrase()
      this.props.updatePhraseArray()
    }));

  }

  getTitle = () => {
    const subtitleCss = {
      fontSize: '20px',
      fontWeight: 'bold'
    }
    return <p style={subtitleCss}> 近义词列表 </p>
  }

  render() {

    const style={
      phraseBox:{
        marginTop: '15px'
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
      phraseItem:{
        background: '#fbfbfb',
        paddingLeft: '10px'
      },
      phraseText:{
        display: 'inline-block',
        padding: '5px 10px',
        margin: '7px',
        marginRight: '15px',
        background: '#ccc',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '3px'
      },
      phraseBox:{
        background: '#fbfbfb',
        padding: '15px',
        width: '100%',
        height: '100%',
        borderRadius: '15px'
      }
    }  
    return (
        <div style={style.phraseBox}> 
          {this.getTitle()}
          <ul style={style.phraseBox}>
            {this.props.phraseArray.map((phrase, index) => {
              return  <li key={index} style={{...style.phraseItem, background: index%2===0?'#fbfbfb':'#fff'}}>
                <div style={style.phraseText}>{phrase.phraseId}</div>
                {
                  phrase.similars.map((item,i) => {
                    return <div style={style.phraseText} key={i}>{item}<Icon onClick={this.delPhraseText.bind(this,phrase,i)} type="close" /></div>
                  })
                }
                <div onClick={this.showAddPhrase.bind(this,phrase)} style={style.phraseText}>添加</div>
                <div onClick={this.delPhraseItem.bind(this,phrase)} style={style.phraseText}>删除</div>
              </li>
            })}
          </ul>
          <Modal
              title="添加近义词"
              centered
              visible={this.state.showModalFlag}
              onOk={() => this.addPhraseText()}
              onCancel={() => this.hideAddPhrase()}
              destroyOnClose={true}
          >
            <Input onBlur={this.getPhraseText.bind(this)}></Input>
            <span>如果添加多个中间用逗号隔开，如：漂亮，美丽</span>
          </Modal>
        </div>)

  }
}