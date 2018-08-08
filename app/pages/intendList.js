import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router'
import { Spin, Icon, Form, Input, Button, Row, Col, Modal } from 'antd'
import { isArrayDomain } from 'utils/util'
import { fetchIntend, fetchEntity, fetchCorpus, postCorpus, simplifier, predict, getPhrase, putPhrase, deletePhrase, postPhrase } from 'actions/intend'

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
      varietyEntity: [],
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
      phraseText: '',
      phraseIndex:''
    }
    this.addPhraseText = this.addPhraseText.bind(this)
    this.hideAddPhrase = this.hideAddPhrase.bind(this)
    this.getPhraseText = this.getPhraseText.bind(this)
  }
  componentWillMount() {
    // 请求相应的预料，对signWord进行赋值等等
    const agentName = sessionStorage.getItem('agentName');
    this.props.dispatch(fetchIntend('?agent=' + agentName, data =>{
      if(data.length){
        this.setState({
          originEntity: [...data],
          name: data[0].name,
          zhName: data[0].zhName,
          modelPath: data[0].modelPath,
          intentId: data[0].intentId
        })
        this.props.dispatch(fetchEntity('?agent=' + agentName + '&intentId=' + data[0].intentId, data => {
          for(let i=0;i<data.length;i++){
            data[i].valuesF = [...data[i].values]
            for(let j=0;j<data[i].valuesF.length;j++){
              data[i].valuesF[j] = data[i].valuesF[j].replace('/'+data[i].subEntities[0].match(":(.*)")[1]+' ','')
            }
            data[i].valuesTen = data[i].valuesF.length > 10 ? [...data[i].valuesF.slice(0,10)] : [...data[i].valuesF]
            data[i].valuesShow = [...data[i].valuesTen]
          }
          this.setState({
            entityParam: [...data]
          })
        }, error => {

        }))
        this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + data[0].intentId
        , data => {
          console.log(data)
              this.setState({
                phraseArray: [...data]
              })
        }, error => {
          console.log(error)
        }))




      }
    }, error => {
    }))

  }
  componentDidMount() {
    const agentName = sessionStorage.getItem('agentName');
    // this.props.dispatch(fetchCorpus('?agent=' + agentName, data => {
    //   this.setState({
    //     contents: [...data],
    //     content: data[0],
    //   })
    // }, error => {
    //
    // }))
  }
  // getMore() {
  //   this.setState({
  //     varietyEntity: [...this.state.originEntity]
  //   })
  // }
  getIntend(item,index) {
    console.log(item)
    this.setState({
      name: item.name,
      zhName: item.zhName,
      modelPath: item.modelPath,
      intentId: item.intentId,
      intent: item.name,
      varietyEntity: [this.state.originEntity[index]]
    })
    this.props.dispatch(fetchEntity('?agent=' + agentName + '&intentId=' + item.intentId, data => {
      for(let i=0;i<data.length;i++){
        data[i].valuesF = [...data[i].values]
        for(let j=0;j<data[i].valuesF.length;j++){
          data[i].valuesF[j] = data[i].valuesF[j].replace('/'+data[i].subEntities[0].match(":(.*)")[1]+' ','')
        }
        data[i].valuesTen = data[i].valuesF.length > 10 ? [...data[i].valuesF.slice(0,10)] : [...data[i].valuesF]
        data[i].valuesShow = [...data[i].valuesTen]
      }
      this.setState({
        entityParam: [...data]
      })
    }, error => {

    }))
    this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + item.intentId
        , data => {
          console.log(data)
          this.setState({
            phraseArray: [...data]
          })
        }, error => {
          console.log(error)
        }))
  }
  wordEnd(e) {
    if(window.getSelection){
      if(window.getSelection().toString()){
        console.log(window.getSelection())
        //anchorOffset
        //extentOffset
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
    this.setState({
      phraseArray: [...this.state.phraseArray.splice(index,1)]
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
        borderRadius: '15px',
        paddingTop: '55px'
      },
      intendBox:{
        width: '400px',
        height: '100%',
        marginLeft: '-410px',
        float: 'left',
      },
      innerContainer:{
        width: '100%',
        height: '100%',
        paddingTop: '55px',
      },
      innerBox:{
        height: '100%',
        paddingLeft: '410px',
      },
      newCorpusBox:{
        width: '300px',
        height: '32px',
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
        color: '#fff'
      }
    };

    return <Spin spinning={intendResult.loading}>
      <div style={style.innerContainer}>
        <Link className='bread-cruft' to={'/selectService'}><Icon type='left'></Icon>服务器选择</Link>
        <div style={style.innerBox}>
          <div style={style.intendBox}>
            <div style={{...style.corpusBox, display: this.state.originEntity.length ? 'block' : 'none'}}>
              {this.state.originEntity.length ? this.state.intentId.length && this.state.originEntity.length == 1 ? <div style={style.headerTitle}>选择的意图</div> : <div style={style.headerTitle}>请选择所属意图</div> : ''}
              <div style={{height: '100%',overflowY:'auto'}}>
                <ul style={style.flexBox}>
                  {
                    this.state.originEntity.map((item, index) => {
                      return <li className={item.intentId==this.state.intentId? 'active-btn': ''} onClick={this.getIntend.bind(this,item,index)} style={style.serveLi} key={item.intentId}>{item.zhName || item.name}</li>
                    })
                  }
                  {/*{*/}
                    {/*this.state.originEntity.length > 10 && this.state.varietyEntity.length <= 10 ? <li onClick={this.getMore.bind(this)} style={style.serveLi}>···</li> : ''*/}
                  {/*}*/}
                </ul>
              </div>
            </div>
            <div style={{...style.corpusBox, fontSize: '14px', display : this.state.originEntity.length ? 'none' : 'block',}}>没有意图</div>
          </div>

          <div style={{height:'100%',overflow:'auto'}}>
            { !intendResult.loading ? <div className="container">
              <Row style={{height: '100px',background: '#fbfbfb',padding: '0 15px',fontSize: '14px',marginBottom:'15px'}}>
                <Col style={style.col} span={12} >name:{this.state.name}</Col>
                <Col style={style.col} span={12} >zhName:{this.state.zhName}</Col>
                <Col style={style.col} span={24} >modelPath:{this.state.modelPath}</Col>
              </Row>
              <div style={style.corpusBox}>
                <ul style={style.flexBox}>
                  {
                    this.state.entityParam.map((item,i) => {
                      return <li style={{...style.serveLi,color:'#fff'}} key={item.entity} onClick={this.setColor.bind(this,item)}><span style={{...style.serveLiSpan, background: item.color, border:'1px solid '+item.color+"'"}} >{item.name}</span>{item.valuesShow.map((value, index) => {
                        return <span style={{...style.serveLiSpan, background: item.color, border:'1px solid '+item.color+"'"}} key={index}>{value}</span>
                      })}
                      {
                        item.values.length>10 ? item.valuesShow.length<=10?<span onClick={this.showMoreValues.bind(this,i)} style={{...style.serveLiSpan, background: item.color, border:'1px solid '+item.color+"'"}}>···</span>:<span onClick={this.showLessValues.bind(this,i)} style={{...style.serveLiSpan, background: item.color, border:'1px solid '+item.color+"'"}}>-</span>: ''
                      }
                      </li>
                    })
                  }
                </ul>
                <div style={style.pBox}>
                  {/*<Icon type='close' className='off_btn'></Icon>*/}
                  {this.state.contents.length ? this.state.contents.map((content,index) => {
                    return <p key={index} style={style.p}  onMouseUp={this.wordEnd.bind(this)} dangerouslySetInnerHTML={{__html: content.pattern.sentence}}></p>
                  }) : <p style={style.p}>没有语料了，小主你吃个西瓜，休息一下吧！</p>}
                </div>
                <div style={style.funBox}>
                  <div style={{...style.button,background: '#188ae2',border: '1px solid #188ae2'}} onClick={this.submit.bind(this)}>提交</div>
                  <div style={{...style.button, background : '#cacaca',border: '1px solid #cacaca'}} onClick={this.reBack.bind(this)}>取消</div>
                  <div style={{...style.button, background : '#cacaca',border: '1px solid #cacaca'}} onClick={this.getNext.bind(this)}>丢弃</div>
                </div>
                <Form layout="inline">
                  <FormItem>
                    {getFieldDecorator('newCorpus', {
                    })(
                        <Input  style={{width:'300px'}} placeholder="请输入新的语料" onPressEnter={this.simplifier.bind(this)} onChange={this.corpusInput.bind(this)} onBlur={this.corpusBlur.bind(this)}/>
                    )}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" disabled={!this.state.newCorpus} onClick={this.simplifier.bind(this)}>
                      简化
                    </Button>
                  </FormItem>
                </Form>
                <div style={{display:'flex',marginTop: '20px'}}>
                  <div style={style.newCorpusBox}>{this.state.simCorpus}</div>
                  <Button onClick={this.useSimCorpus.bind(this)} type="primary" disabled={!this.state.simCorpus} style={{marginLeft: '16px'}}>
                    使用简化模型
                  </Button>
                  <Button onClick={this.noUseSimCorpus.bind(this)}>不使用简化模型</Button>
                </div>
              </div>
              <ul style={style.phraseBox}>
                {this.state.phraseArray.map((phrase, index) => {
                  return  <li key={index} style={{...style.phraseItem, background: index%2===0?'#fbfbfb':'#fff'}}>
                        {
                          phrase.similars.map((item,i) => {
                            return <div style={style.phraseText} key={i}>{item}<Icon onClick={this.delPhraseText.bind(this,index,i)} type="close" /></div>
                          })
                        }
                    <div onClick={this.showAddPhrase.bind(this,index)} style={style.phraseText}>添加</div>
                    <div onClick={this.delPhraseItem.bind(this,index)} style={style.phraseText}>删除</div>
                  </li>
                })}
              </ul>
            </div> : '' }
          </div>
        </div>
      </div>
      <Modal
          title="添加近义词"
          centered
          visible={this.state.showModalFlag}
          onOk={() => this.addPhraseText()}
          onCancel={() => this.hideAddPhrase()}
          destroyOnClose={true}
      >
        <Input onBlur={this.getPhraseText}></Input>
        <span>如果添加多个中间用逗号隔开，如：漂亮，美丽</span>
      </Modal>
    </Spin>
  }
}
