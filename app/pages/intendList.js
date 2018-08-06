import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router'
import { Spin, Icon } from 'antd'
import { isArrayDomain } from 'utils/util'
import { fetchIntend, fetchEntity, fetchCorpus, postCorpus } from 'actions/intend'

const agentName = sessionStorage.getItem('agentName');
console.log(agentName)

@connect((state, dispatch) => ({
  config: state.config,
  intendResult: state.intendResult,
  entityResult: state.entityResult,
}))
export default class intendList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      originEntity: [],
      varietyEntity: [],
      contents:[],
      content: '',
      value:'',
      intentId: 1,
      signWord: '',
      signWords: [],
      replaceWords: [],
    }
  }
  componentWillMount() {
    // 请求相应的预料，对signWord进行赋值等等
    const agentName = sessionStorage.getItem('agentName');
    this.props.dispatch(fetchIntend('?agent=' + agentName, data =>{
      let arr = data.length > 10 ? [].concat(data.slice(0,10)) : [...data]
      this.setState({
        originEntity: [...data],
        varietyEntity: [...arr]
      })
    }, error => {
      this.setState({
        originEntity: [],
        varietyEntity: []
      })
    }))
  }
  componentDidMount() {
    const agentName = sessionStorage.getItem('agentName');
    this.props.dispatch(fetchCorpus('?agent=' + agentName, data => {
      this.setState({
        contents: [...data],
        content: data[0],
      })
    }, error => {

    }))
  }
  getMore() {
    this.setState({
      varietyEntity: [...this.state.originEntity]
    })
  }
  getIntend(item,index) {

    this.setState({
      intentId: item.intentId,
      intent: item.name,
      varietyEntity: [this.state.originEntity[index]]
    })
    this.props.dispatch(fetchEntity('?agent=' + agentName + '&intentId=' + item.intentId, data => {
      for(let i=0;i<data.length;i++){
          for(let j=0;j<data[i].values.length;j++){
            data[i].values[j] = data[i].values[j].replace(/[^\u4e00-\u9fa5]/g,'')
          }
      }
    }, error => {

    }))
  }
  wordEnd(e) {
    if(window.getSelection){
      if(window.getSelection().toString()){
        this.setState({
          signWord:window.getSelection().toString()
        })
      }
    }else if(document.getSelection) {
      console.log(document.getSelection())
      if(window.getSelection().toString()){
        this.setState({
          signWord:window.getSelection().toString()
        })
      }
    }else if(document.selection) {
      console.log(document.selection)
      if(window.getSelection().toString()){
        this.setState({
          signWord:window.getSelection().toString()
        })
      }
    }
  }
  setColor(obj) {
    this.setState({
      signWords: [...this.state.signWords, this.state.signWord],
      replaceWords: [...this.state.replaceWords, '['+this.state.signWord+']'+obj.label]
    })
    this.setState({
      content: this.state.content.replace(eval('/'+this.state.signWord+'/g'),'<span style="background: '+obj.color+';color:#fff;border-radius:2px;padding: 2px 5px">'+this.state.signWord+'</span>')
    })
  }
  submit() {
    let param = {};
    param.sentence = this.state.contents[0]
    this.state.signWords.map((item, index) => {
      param.sentence = param.sentence.replace(eval('/' + item + '/g'), this.state.replaceWords[index])
    })
    param.intentId = this.state.intentId;
    param.intent = this.state.intent;
    param.accept = true;
    param.agent = sessionStorage.getItem('agentName');
    this.props.dispatch(postCorpus(param, data => {
        this.getNext();
    }, error => {

    }))
  }
  reBack() {
    this.setState({
      content: this.state.contents[0]
    })
  }
  getNext() {
    this.state.contents.shift();
    this.state.contents.length ? this.setState({
        content: this.state.contents[0]
      }) : this.setState({
      content: ''
    })
  }
  render() {

    const { intendResult, entityResult } = this.props;

    const style = {
      container: {
        background: '#fff',
      },
      headerTitle:{
        lineHeight: '40px',
        fontSize: '16px',

      },
      flexBox: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-start',
      },
      serveLi: {
        border: '1px solid #dadada',
        borderRadius: '5px',
        padding: '5px 10px',
        fontSize: '14px',
        marginBottom: '10px',
        marginRight: '10px',
        cursor: 'pointer',
      },
      pBox:{
        position: 'relative',
        border: '1px solid #dadada',
      },
      p: {
        background: '#fcfcfc',
        color: '#333',
        fontSize: '16px',
        textAlign: 'center',
        lineHeight: '100px',
      },
      button:{
        fontSize: '16px',
        padding: '8px 12px',
        lineHeight: '16px',
        borderRadius: '3px',
        border: '1px solid #dadada',
        display: 'inline-block',
        marginLeft: '20px',
        color: '#fff',
        cursor: 'pointer'
      },
      funBox:{
        textAlign: 'right',
        marginTop: '20px',
      },
      corpusBox:{
        background: '#fbfbfb',
        padding: '30px 30px 20px 30px',
        width: '90%',
        borderRadius: '15px',
        margin: '20px auto',
      }
    };

    return <Spin spinning={intendResult.loading}>

      <Link className='bread-cruft' to={'/selectService'}><Icon type='left'></Icon>服务器选择</Link>
      { !intendResult.loading ? <div className="container">
        <Row gutter={12}>
          <Col span={6} lg={4}>name:</Col>
          <Col span={6} lg={4}>zhName:</Col>
          <Col span={12} lg={4}>modelPath:</Col>
        </Row>


        <div style={style.corpusBox}>
          <ul style={style.flexBox}>
            {
              entityResult.map(item => {
                return <li style={{...style.serveLi,background: item.color,color:'#fff',border:'1px solid '+item.color+"'"}} key={item.entity} onClick={this.setColor.bind(this,item)}>{item.name}</li>
              })
            }
          </ul>
          <div style={style.pBox}>
            {/*<Icon type='close' className='off_btn'></Icon>*/}
            {this.state.contents.length ? <p style={style.p}  onMouseUp={this.wordEnd.bind(this)} dangerouslySetInnerHTML={{__html: this.state.content}}></p> : <p style={style.p}>没有语料了，小主你吃个西瓜，休息一下吧！</p>}
          </div>
          <div style={style.funBox}>
            <div style={{...style.button,background: '#188ae2',border: '1px solid #188ae2'}} onClick={this.submit.bind(this)}>提交</div>
            <div style={{...style.button, background : '#cacaca',border: '1px solid #cacaca'}} onClick={this.reBack.bind(this)}>取消</div>
            <div style={{...style.button, background : '#cacaca',border: '1px solid #cacaca'}} onClick={this.getNext.bind(this)}>丢弃</div>
          </div>
        </div>
        <div style={{...style.corpusBox, display: this.state.varietyEntity.length ? 'block' : 'none'}}>
          {this.state.varietyEntity.length ? this.state.intentId.length && this.state.varietyEntity.length == 1 ? <div style={style.headerTitle}>选择的意图</div> : <div style={style.headerTitle}>请选择所属意图</div> : ''}
          <div style={{maxHeight: '301px',overflowY:'auto'}}>
            <ul style={style.flexBox}>
              {
                this.state.varietyEntity.map((item, index) => {
                  return <li className={item.intentId==this.state.intentId? 'active-btn': ''} onClick={this.getIntend.bind(this,item,index)} style={style.serveLi} key={item.intentId}>{item.zhName || item.name}</li>
                })
              }
              {
                this.state.originEntity.length > 10 && this.state.varietyEntity.length <= 10 ? <li onClick={this.getMore.bind(this)} style={style.serveLi}>···</li> : ''
              }
            </ul>
          </div>

        </div>
        <div style={{...style.corpusBox, fontSize: '14px', display : this.state.varietyEntity.length ? 'none' : 'block',}}>没有意图</div>
      </div> : '' }
        </Spin>
  }
}
