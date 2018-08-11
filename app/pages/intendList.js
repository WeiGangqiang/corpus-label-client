import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Spin, Icon, Form, Row, Col} from 'antd'
import { isArrayDomain } from 'utils/util'
import { fetchIntend, fetchEntity,postPattern, postCorpus, simplifier, predict, getPhrase, putPhrase, deletePhrase, postPhrase } from 'actions/intend'

import { PatternList, PhraseList, EntityParameters, IntentList, CorpusSimplifier } from "components/index";

const agentName = sessionStorage.getItem('agentName');

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
      intentId: '1',
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
    this.initData = this.initData.bind(this);
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
    console.log('update intentid', obj.intentId, this.state.intentId)
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
      console.log(data)
      this.setState({
        entityParam: [...data]
      })
    }, error => {

    }))
    this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + obj.intentId
        , data => {
      console.log(data)
          this.setState({
            phraseArray: [...data]
          })
        }, error => {
          console.log(error)
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

  useSimCorpus(simCorpus) {
    this.props.dispatch(postPattern({
      pattern: {
        sentence: simCorpus,
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
    //   const content = {
    //     pattern: {
    //       sentence: this.state.simCorpus,
    //       labels: data
    //     },
    //     type: "positive",
    //     intentId: this.state.intentId,
    //     intent: this.state.name,
    //     agent: agentName
    // }
    //   this.setState({
    //     contents:[...this.state.contents, content],
    //     newCorpus: '',
    //     simCorpus: ''
    //   });
    //   this.props.form.setFieldsValue({
    //     newCorpus: ''
    //   })
    }, error => {
      console.log(error)
    }))

  }
  noUseSimCorpus(newCorpus) {
    this.props.dispatch(postPattern({
      pattern: {
        sentence: newCorpus,
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
      // const content = {
      //   pattern: {
      //     sentence: this.state.newCorpus,
      //     labels: data
      //   },
      //   type: "positive",
      //   intentId: this.state.intentId,
      //   intent: this.state.name,
      //   agent: agentName
      // }
      // this.setState({
      //   contents:[...this.state.contents, content],
      //   newCorpus: '',
      //   simCorpus: ''
      // });
      // this.props.form.setFieldsValue({
      //   newCorpus: ''
      // })
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

  render() {

    const { intendResult } = this.props;

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
    console.log('this.state.intentId', this.state.intentId)

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

                <PatternList agentName={agentName}  intentId={this.state.intentId} corpusType={this.state.type}/>
                <CorpusSimplifier useSimCorpus={this.useSimCorpus} noUseSimCorpus={this.noUseSimCorpus}></CorpusSimplifier>

              </div>

              <PhraseList intent={this.state.name} agent={agentName} phraseArray={this.state.phraseArray} updatePhraseArray={this.getPhrase}></PhraseList>

            </div> : '' }
          </div>
        </div>
      </div>
    </Spin>
  }
}
