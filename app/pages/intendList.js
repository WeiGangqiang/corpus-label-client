import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router'
import { Spin, Icon, Form, Input, Button, Row, Col, Modal } from 'antd'
import { isArrayDomain } from 'utils/util'
import { fetchIntend, fetchEntity, fetchCorpus, postCorpus, simplifier, predict, getPhrase, putPhrase, deletePhrase, postPhrase } from 'actions/intend'

import { PatternLine, PhraseList, EntityParameters, IntentList, CorpusSimplifier } from "components/index";

const agentName = sessionStorage.getItem('agentName');
const FormItem = Form.Item

@connect((state, dispatch) => ({
  config: state.config,
  intendResult: state.intendResult,
  entityResult: state.entityResult,
}))

@Form.create({
  onFieldsChange(props, items) {
  },
})
export default class intendList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      originEntity: [],
      contents:[],
      content: '',
      value:'',
      intentId: 1,
      signWord: '',
      signWords: [],
      replaceWords: [],
      name: '',
      zhName: '',
      modelPath: '',
      newCorpus: '',
      simCorpus: '',
      entityParam: [],
      phraseArray: [],
      showModalFlag: false,
      showModalPatternFlag: false,
      phraseText: '',
      phraseIndex:'',
      contentIndex: '',
      type: 'positive'
    };
    this.addPhraseText = this.addPhraseText.bind(this);
    this.hideAddPhrase = this.hideAddPhrase.bind(this);
    this.getPhraseText = this.getPhraseText.bind(this);
    this.initData = this.initData.bind(this);
    this.showSignWord = this.showSignWord.bind(this);
    this.getIntent = this.getIntent.bind(this)
    this.getPhrase = this.getPhrase.bind(this)
    this.showMoreValues = this.showMoreValues.bind(this)
    this.showLessValues = this.showLessValues.bind(this)
    this.useSimCorpus = this.useSimCorpus.bind(this)
    this.noUseSimCorpus = this.noUseSimCorpus.bind(this)

  }
  componentWillMount() {
    // 请求相应的预料，对signWord进行赋值等等
    const agentName = sessionStorage.getItem('agentName');
    this.props.dispatch(fetchIntend('?agent=' + agentName, data =>{
      if(data.length){
        this.setState({
          originEntity: [...data]
        })
        this.initData(data[0])
      }
    }, error => {
    }))

  }
  componentDidMount() {
  }
  getIntent(item,index) {
    this.setState({
      contents:[],
      signWords: [],

    })
    this.initData(item)
  }
  initData(obj) {
    const colorArray = ['#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2'];
    this.setState({
      name: obj.name,
      zhName: obj.zhName,
      modelPath: obj.modelPath,
      intentId: obj.intentId
    });
    this.props.dispatch(fetchEntity('?agent=' + agentName + '&intentId=' + obj.intentId, data => {
      for(let i=0;i<data.length;i++){
        data[i].valuesF = [...data[i].values]
        for(let j=0;j<data[i].valuesF.length;j++){
          let reg = /[\[\]]/g
          let labelReg = /\/L[0-9]/g
          data[i].valuesF[j] = data[i].valuesF[j].replace(reg,'').replace(labelReg, '')
        }
        data[i].valuesShow = [...data[i].valuesF.slice(0,10)]
      }
      this.setState({
        entityParam: [...data]
      })
    }, error => {

    }))
    this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + obj.intentId
        , data => {
          this.setState({
            phraseArray: [...data]
          })
        }, error => {
          console.log(error)
        }))
    this.props.dispatch(getPattern('?agent='+agentName+'&intentId='+obj.intentId+'&type='+this.state.type,data => {
      for(let i=0;i<data.length;i++){
        let content = {
          pattern: {
            sentence: data[i].sentence,
            labels: data[i].labels
          },
          type: this.state.type,
          intentId: this.state.intentId,
          intent: this.state.name,
          agent: agentName
        }
        for(let j=0;j<data[i].labels.length;j++){
            let signItem = {
              signWord:data[i].sentence.substr(data[i].labels[j].startPos,data[i].labels[j].length),
              signWordStart:data[i].labels[j].startPos,
              signWordEnd:parseInt(data[i].labels[j].startPos) -(-data[i].labels[j].length),
              color:colorArray[i],
              id: data[i].labels[j].id,
              type: data[i].labels[j].type
            }
            if(!this.state.signWords[i]){
              this.state.signWords[i]=[]
            }
            this.state.signWords[i] = [...this.state.signWords[i],signItem]
        }
        if(this.state.signWords[i]&&this.state.signWords[i].length>1){
          this.state.signWords[i].sort(function(obj1, obj2){
            return obj1.signWordStart < obj2.signWordStart
          })
        }
        this.setState({
          contents:[...this.state.contents, content],
          signWords:[...this.state.signWords]
        });
      }
    },error => {

    }))
  }
  getPhrase () {
    this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + this.state.intentId
        , data => {
          this.setState({
            phraseArray: [...data]
          })
        }, error => {
          console.log(error)
        }))
  }
  wordEnd(index, e) {
    console.log(e.target.pageX,e.target.pageY)
    this.setState({
      contentIndex: index
    })
    if(window.getSelection){

      // var range = window.getSelection().getRangeAt(0);
      // console.log(range)
      // var offset = 0;
      // var str = '';
      // var container = range.startContainer;
      // while(container.previousSibling){
      //   str += container.previousSibling.textContent.trim();
      //   offset += container.previousSibling.textContent.trim().length;
      //   container = container.previousSibling;
      // }

      if(window.getSelection().toString()){
        //anchorOffset
        //extentOffset
        this.setState({
          signWord:window.getSelection().toString(),
          signWordStart: window.getSelection().anchorOffset<=window.getSelection().extentOffset?window.getSelection().anchorOffset:window.getSelection().extentOffset,
          signWordEnd: window.getSelection().extentOffset>window.getSelection().anchorOffset?window.getSelection().extentOffset:window.getSelection().anchorOffset
        })
      }
    }else if(document.getSelection) {
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
    if(!this.state.signWords[this.state.contentIndex]){
      this.state.signWords[this.state.contentIndex]=[]
    }
    for(let i=0;i<this.state.signWords[this.state.contentIndex].length;i++){
      if(this.state.signWordEnd<=this.state.signWords[this.state.contentIndex][i].signWordStart||this.state.signWordStart>=this.state.signWords[this.state.contentIndex][i].signWordEnd){

      }else{
        this.state.signWords[this.state.contentIndex].splice(i,1)
        i--;
      }
    }
    this.state.signWords[this.state.contentIndex] = [...this.state.signWords[this.state.contentIndex],{
      signWord:this.state.signWord,
      signWordStart:this.state.signWordStart,
      signWordEnd:this.state.signWordEnd,
      color:obj.color||'#1976d2',
      id:obj.name||obj.phraseId,
      type: obj.name?'entity':'phrase'
    }]
    if(this.state.signWords[this.state.contentIndex].length>1){
      this.state.signWords[this.state.contentIndex].sort(function(obj1, obj2){
        return obj1.signWordStart < obj2.signWordStart
      })
    }
    this.setState({
      signWords: [...this.state.signWords],
      signWord: '',
      signWordStart: '',
      signWordEnd: ''
    })
  }
  addPhrase() {

    this.props.dispatch(postPhrase({
      similars: [this.state.signWord],
      intentId: this.state.intentId,
      intent: this.state.name,
      agent: agentName
    },data => {
      this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + this.state.intentId
          , data => {
              console.log(data)
            this.setState({
              phraseArray: [...data]
            })
          }, error => {
            console.log(error)
          }))
    }))
  }
  showSignWord(arr,word) {
    let showSign='';
    if(arr){
      for(let i=0;i<arr.length;i++){
        showSign = showSign + word.substring(0,arr[i].signWordStart) + '<span class="corpusSpan" style="background: '+ arr[i].color+'">' + word.substring(arr[i].signWordStart,arr[i].signWordEnd) + '</span>' + word.substring(arr[i].signWordEnd)
        word = showSign;
        showSign = ''
    }
    }
    return word
  }
  submit(index,content) {
    // let param = {};
    // param.sentence = this.state.contents[0]
    // this.state.signWords.map((item, index) => {
    //   param.sentence = param.sentence.replace(eval('/' + item + '/g'), this.state.replaceWords[index])
    // })
    // param.intentId = this.state.intentId;
    // param.intent = this.state.name;
    // param.accept = true;
    // param.agent = sessionStorage.getItem('agentName');
    // this.props.dispatch(postCorpus(param, data => {
    //     this.getNext();
    // }, error => {
    //
    // }))
    const signItem = this.state.signWords[index]
    console.log(signItem)
    let labels=[]
    for(let i=0;i<signItem.length;i++){
      labels = [...labels,{
        type: signItem[i].type,
        id: signItem[i].id,
        length: signItem[i].signWordEnd-signItem[i].signWordStart,
        startPos: signItem[i].signWordStart
      },]
    }
    var param={
      pattern: {
        sentence: content.pattern.sentence,
        labels: labels
      },
      type: this.state.type,
      patternId: index,
      intentId: this.state.intentId,
      intent: this.state.name,
      agent: agentName
    }
    this.props.dispatch(putPattern(param,data=>{
      console.log(data)
    },error=>{

    }))
  }
  reBack() {
    this.setState({
      content: this.state.contents[0]
    })
  }
  delPattern(index) {
    this.props.dispatch(deletePattern({
      "patternId": index,
      "type"     : this.state.type,
      "intentId" : this.state.intentId,
      "intent"   :this.state.name,
      "agent"    : agentName
  }))
  }
  getNext() {
    this.state.contents.shift();
    this.state.contents.length ? this.setState({
        content: this.state.contents[0]
      }) : this.setState({
      content: ''
    })
  }

  simplifier() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(simplifier({x:values.newCorpus}, data => {
          console.log(data)
          this.setState({
            simCorpus:data.y
          })
        }, err => {
          console.log(err)
        }))
      }
    })
  }
  corpusInput() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          newCorpus: values.newCorpus
        })
      }
    })
  }
  corpusBlur() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          newCorpus: values.newCorpus
        })
      }
    })
  }

  useSimCorpus() {
    this.props.dispatch(postPattern({
      pattern: {
        sentence: this.state.simCorpus,
        labels:[]
      },
      type: this.state.type,
      intentId: this.state.intentId,
      intent: this.state.name,
      agent:agentName
  }))
    this.props.dispatch(predict({
      "sentence" : this.state.simCorpus,
      "intentId" : this.state.intentId,
      "agent"    : agentName
    },data => {
      const content = {
        pattern: {
          sentence: this.state.simCorpus,
          labels: data
        },
        type: "positive",
        intentId: this.state.intentId,
        intent: this.state.name,
        agent: agentName
    }
      this.setState({
        contents:[...this.state.contents, content],
        newCorpus: '',
        simCorpus: ''
      });
      this.props.form.setFieldsValue({
        newCorpus: ''
      })
    }, error => {
      console.log(error)
    }))

  }
  noUseSimCorpus() {
    this.props.dispatch(postPattern({
      pattern: {
        sentence: this.state.newCorpus,
        labels:[]
      },
      type: this.state.type,
      intentId: this.state.intentId,
      intent: this.state.name,
      agent:agentName
    }))
    this.props.dispatch(predict({
      "sentence" : this.state.newCorpus,
      "intentId" : this.state.intentId,
      "agent"    : agentName
    },data => {
      const content = {
        pattern: {
          sentence: this.state.newCorpus,
          labels: data
        },
        type: "positive",
        intentId: this.state.intentId,
        intent: this.state.name,
        agent: agentName
      }
      this.setState({
        contents:[...this.state.contents, content],
        newCorpus: '',
        simCorpus: ''
      });
      this.props.form.setFieldsValue({
        newCorpus: ''
      })
    }, error => {
      console.log(error)
    }))
  }

  showMoreValues(i) {
    this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF]
    this.setState({
      entityParam: this.state.entityParam
    })
  }
  showLessValues(i) {
    this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF.slice(0,10)]
    this.setState({
      entityParam: this.state.entityParam
    })
  }

  delPhraseText(index,i) {
    this.state.phraseArray[index].similars.splice(i,1);
    this.props.dispatch(putPhrase({
        ...this.state.phraseArray[index],
      intent: this.state.name,
      agent: agentName
    }))
    this.setState({
      phraseArray: [...this.state.phraseArray]
    })
  }
  delPhraseItem(index) {
    this.props.dispatch(deletePhrase({
      phraseId: this.state.phraseArray[index].phraseId,
      intentId: this.state.phraseArray[index].intentId,
      intent: this.state.name,
      agent: agentName
    }))
    this.state.phraseArray.splice(index,1)
    this.setState({
      phraseArray: [...this.state.phraseArray]
    })
  }
  showAddPhrase(index) {
    this.setState({
      showModalFlag: true,
      phraseIndex: index
    })
  }
  addPhraseText() {
    const phraseText = this.state.phraseText.replace('，',',').split(',');
    this.state.phraseArray[this.state.phraseIndex].similars = this.state.phraseArray[this.state.phraseIndex].similars.concat(phraseText)
    this.props.dispatch(putPhrase({
      ...this.state.phraseArray[this.state.phraseIndex],
      intent: this.state.name,
      agent: agentName
    }))
    this.setState({
      phraseArray:this.state.phraseArray,
      showModalFlag: false,
      phraseText: '',
      phraseIndex: ''
    })
  }
  hideAddPhrase() {
    this.setState({
      showModalFlag: false,
      phraseText: '',
      phraseIndex: ''
    })
  }
  getPhraseText(e) {
    this.setState({
      phraseText: e.target.value
    })
  }

  render() {

    const { intendResult, entityResult } = this.props;

    const {getFieldDecorator} = this.props.form

    const style = {
      container: {
        background: '#fff',
      },
      headerTitle:{
        lineHeight: '40px',
        fontSize: '16px',
        float: 'left',
        marginTop: '-40px',

      },
      flexBox: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-start',
        flexDirection: 'column'
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
        padding: '15px',
        width: '100%',
        height: '100%',
        borderRadius: '15px'
      },
      intendBox:{
        height: '100%',
        float: 'left',
      },
      innerContainer:{
        width: '100%',
        height: '100%',
        paddingTop: '55px',
      },
      innerBox:{
        height: '100%'
      },
      newCorpusBox:{
        width: '300px',
        lineHeight: '32px',
        display: 'inline-block',
        border: '1px solid #dadada',
        borderRadius: '4px',
        paddingLeft: '15px',
        fontSize:'14px'
      },
      col:{
        lineHeight: '40px'
      },
      phraseBox:{
        marginTop: '15px'
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
      corpusSpan:{
        width: '20px',
        textAlign: 'center',
        marginLeft: '-20px',
        float: 'left',
      },
      corpusCol:{
        paddingLeft: '20px',
        paddingRight: '20px'
      },
      phraseDiv:{
        width: '20px',
        textAlign: 'center',
        marginRight: '-20px',
        float: 'right',
      }
    };

    return <Spin spinning={intendResult.loading}>
      <div style={style.innerContainer}>
        <Link className='bread-cruft' to={'/selectService'}><Icon type='left'></Icon>服务器选择</Link>
        <div style={style.innerBox} className='intentContainer'>

          <IntentList originEntity={this.state.originEntity} intentId={this.state.intentId} getIntent={this.getIntent}></IntentList>

          <div style={{height:'100%',overflow:'auto'}}>
            { !intendResult.loading ? <div className="container">
              <Row style={{height: '100px',background: '#fbfbfb',padding: '0 15px',fontSize: '14px',marginBottom:'15px'}}>
                <Col style={style.col} span={12} >name:{this.state.name}</Col>
                <Col style={style.col} span={12} >zhName:{this.state.zhName}</Col>
                <Col style={style.col} span={24} >modelPath:{this.state.modelPath}</Col>
              </Row>
              <div style={style.corpusBox}>

                <EntityParameters entityParam={this.state.entityParam} showLessValues={this.showLessValues} showMoreValues={this.showMoreValues}></EntityParameters>

                {/*<ul style={style.flexBox}>*/}
                  {/*{ */}
                    {/*this.state.entityParam.map((item,i) => {*/}
                      {/*return <li style={{...style.serveLi,color:'#fff'}} key={item.entity} onClick={this.setColor.bind(this,item)}*/}
                              {/*><span style={{...style.serveLiSpan, background: '#188ae2', border:'1px solid '+item.color+"'"}} >{item.name}</span>*/}
                            {/*{item.valuesShow.map((value, index) => {*/}
                              {/*return <span style={{...style.serveLiSpan, background: item.color, border:'1px solid '+item.color+"'"}} key={index}>{value}</span>*/}
                            {/*})}*/}
                      {/*{*/}
                        {/*item.values.length>10 ? item.valuesShow.length<=10?<span onClick={this.showMoreValues.bind(this,i)} style={{...style.serveLiSpan, background: item.color, border:'1px solid '+item.color+"'"}}>···</span>:<span onClick={this.showLessValues.bind(this,i)} style={{...style.serveLiSpan, background: item.color, border:'1px solid '+item.color+"'"}}>-</span>: ''*/}
                      {/*}*/}
                      {/*</li>*/}
                    {/*})*/}
                  {/*}*/}
                {/*</ul>*/}
                <div style={style.pBox}>
                    {this.state.contents.length ? this.state.contents.map((content,index) => {
                      return <Row key={index} >
                        <Col style={style.corpusCol} span={12}>
                          <div style={style.corpusSpan}>标注区</div>
                          <p style={style.p}  onMouseUp={this.wordEnd.bind(this,index)}>{content.pattern.sentence}</p>
                        </Col>
                        <Col style={style.corpusCol} span={12}>
                          <div style={style.corpusSpan}>展示区</div>
                          <p style={style.p} dangerouslySetInnerHTML={{__html: this.showSignWord(this.state.signWords[index],content.pattern.sentence)}}></p>
                        </Col>
                        <div style={style.funBox}>
                          <div style={{...style.button,background: '#188ae2',border: '1px solid #188ae2'}} onClick={this.submit.bind(this,index,content)}>提交</div>
                          <div style={{...style.button, background : '#cacaca',border: '1px solid #cacaca'}} onClick={this.reBack.bind(this,index)}>取消</div>
                          <div style={{...style.button, background : '#cacaca',border: '1px solid #cacaca'}} onClick={this.delPattern.bind(this,index)}>删除</div>
                          {/*<div style={{...style.button, background : '#cacaca',border: '1px solid #cacaca'}} onClick={this.getNext.bind(this,index)}>丢弃</div>*/}
                        </div>
                      </Row>
                    }) : <p style={style.p}>没有语料了，小主你吃个西瓜，休息一下吧！</p>}
                </div>


                <CorpusSimplifier useSimCorpus={this.useSimCorpus} noUseSimCorpus={this.noUseSimCorpus}></CorpusSimplifier>

                {/*<Form layout="inline">*/}
                  {/*<FormItem>*/}
                    {/*{getFieldDecorator('newCorpus', {*/}
                    {/*})(*/}
                        {/*<Input  style={{width:'300px'}} placeholder="请输入新的语料" onPressEnter={this.simplifier.bind(this)} onChange={this.corpusInput.bind(this)} onBlur={this.corpusBlur.bind(this)}/>*/}
                    {/*)}*/}
                  {/*</FormItem>*/}
                  {/*<FormItem>*/}
                    {/*<Button type="primary" disabled={!this.state.newCorpus} onClick={this.simplifier.bind(this)}>*/}
                      {/*简化*/}
                    {/*</Button>*/}
                  {/*</FormItem>*/}
                {/*</Form>*/}
                {/*<div style={{display:'flex',marginTop: '20px'}}>*/}
                  {/*<div style={style.newCorpusBox}>{this.state.simCorpus}</div>*/}
                  {/*<Button onClick={this.useSimCorpus.bind(this)} type="primary" disabled={!this.state.simCorpus} style={{marginLeft: '16px'}}>*/}
                    {/*使用简化模型*/}
                  {/*</Button>*/}
                  {/*<Button onClick={this.noUseSimCorpus.bind(this)}>不使用简化模型</Button>*/}
                {/*</div>*/}
              </div>

              <PhraseList intent={this.state.name} agent={agentName} phraseArray={this.state.phraseArray} updatePhraseArray={this.getPhrase}></PhraseList>

              {/*<ul style={style.phraseBox}>*/}
                {/*<li style={{...style.serveLi,color:'#fff'}}><span onClick={this.addPhrase.bind(this)} style={{...style.serveLiSpan, background: '#09bffd', border:'1px solid #09bffd'}} >添加近义词</span>*/}
                {/*</li>*/}
                {/*{this.state.phraseArray.map((phrase, index) => {*/}
                  {/*return  <li key={index} style={{...style.phraseItem, background: index%2===0?'#fbfbfb':'#fff'}}>*/}
                    {/*<div style={style.phraseText} onClick={this.setColor.bind(this,phrase)}>{phrase.phraseId}</div>*/}
                        {/*{*/}
                          {/*phrase.similars.map((item,i) => {*/}
                            {/*return <div style={style.phraseText} key={i}>{item}<Icon onClick={this.delPhraseText.bind(this,index,i)} type="close" /></div>*/}
                          {/*})*/}
                        {/*}*/}
                    {/*<div onClick={this.showAddPhrase.bind(this,index)} style={style.phraseText}>添加</div>*/}
                    {/*<div onClick={this.delPhraseItem.bind(this,index)} style={style.phraseText}>删除</div>*/}
                  {/*</li>*/}
                {/*})}*/}
              {/*</ul>*/}
            </div> : '' }
          </div>
        </div>
      </div>
    </Spin>
  }
}
