import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form, Row, Col, Layout} from 'antd'

import {UnknownItem, UnknownItemList, IntentTree, UnknownPicker} from "components/index";

import {fetchintent, postPattern, simplifier} from 'actions/intent'
import {unknownList} from 'actions/unknown'

import {intentResult} from "../reducers/intent";

const { Header, Footer, Sider, Content } = Layout;

let agent = '';
let intentId  = '';
@connect((state, dispatch) => ({
  intentResult: state.intentResult,
  unknownList: state.unknownList
}))

export default class unknownSays extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agent: '',
      intentId: '',
      unknownIndex: 0,
      unknownList: [],
      backlog:[],
      suggestion: '',
      acceptSuggestion: true
    };
  }

  doSimplifer = (sentence) => {
    // console.log('enter doSimplifer')
    this.props.dispatch(simplifier({x: sentence}, data => {
      // console.log('simplifer success')
      this.state.suggestion = data.y
      //TODO
      // if (data.y === sentence) {
      //   this.state.suggestion = '简化模型'
      // }
      //////////////////////////////////////////////////////

      this.setState({
        suggestion: this.state.suggestion,
      })
    }, err => {
      console.log(err)
      // console.log('simplifer failed')
      this.state.suggestion = sentence
      this.setState({
        suggestion: this.state.suggestion,
      })
    }))
  }

  componentWillMount() {
    agent = this.props.location.query.agent;
    this.setState({
      agent: agent
    })
    this.props.dispatch(fetchintent('?agent=' + agent, data => {
      // console.log(data)
    }, error => {
      console.log(error)
    }));

    this.props.dispatch(unknownList('?agent=' + agent, data => {
      this.setState({
        unknownList: [...data]
      })
      //TODO for test, should be removed
      // if (!this.state.unknownList.length) {
      //   var step;
      //   for (step = 0; step < 5; step++) {
      //     var dummy = {
      //       sentence: ''
      //     }
      //     dummy.sentence = '我是未识别语料' + step
      //     this.state.unknownList.push(dummy)
      //   }
      // }
      // this.setState({
      //   unknownList: this.state.unknownList,
      // })
      //////////////////////////////////

      this.selectUnknownItem(0)
      // console.log('unknownList fetched:', this.state.unknownList)
    }, error => {
      console.log(error)
    }));

    this.props.dispatch(unknownList('?agent=' + agent, data => {
      this.state.backlog = [...data]
      this.setState({
        backlog: this.state.backlog
      })
      // console.log('backlog fetched:', this.state.backlog)
    }, error => {
      console.log(error)
    }));
  }

  onIntentSelect = (value) => {
    // console.log('onIntentSelect, intent id: ',value);
    if (value) {
      this.state.intentId = value
      // onIntentSelect()
      // console.log('onIntentSelect, intent id: ',this.state.intentId);
      let labels = []

      if (this.state.unknownList.length > this.state.unknownIndex) {
        // console.log('onIntentSelect, intent id: ',this.state.intentId);
        if (this.state.acceptSuggestion) {
          // console.log('onIntentSelect, acceptSuggestion')
          this.addPattern(this.state.suggestion, labels)
        } else {
          // console.log('onIntentSelect, not acceptSuggestion')
          this.addPattern(this.state.unknownList[this.state.unknownIndex].sentence, labels)
        }
        this.deleteUnknownItem(this.state.unknownIndex)
      }
      this.setState({
        intentId: this.state.intentId
      })
    }
  }

  deleteUnknownItem = (index) => {
    // console.log('enter deleteUnknownItem, index:', index)
    if (index < 0 || index >= this.state.unknownList.length) {
        return
    }
    this.state.unknownList.splice(index, 1);

    if (this.state.backlog.length > 0) {
      this.state.unknownList.push(this.state.backlog[0])
      this.state.backlog.shift()
    } else {
      this.props.dispatch(unknownList('?agent=' + agent, data => {
        // console.log('backlog fetched:', data)
        if (data.length > 0) {
          this.state.unknownList.push(data[0])
          data.shift()
        }
        this.state.backlog = [...data]
        this.setState({
          unknownList:this.state.unknownList,
          backlog:this.state.backlog
        })
        this.selectUnknownItem(0)
      }, error => {
        console.log(error)
      }));
    }
    this.setState({
      unknownList:this.state.unknownList,
      backlog:this.state.backlog
    })
    this.selectUnknownItem(0)
  }

  setUnknownItem = (index) => {
    if (index < 0 || index >= this.state.unknownList.length) {
      return
    }
    this.state.suggestion = this.state.unknownList[index].sentence
    this.state.acceptSuggestion = true
    this.setState({
      unknownIndex: index,
      suggestion: this.state.suggestion,
      acceptSuggestion: true
    })
  }

  selectUnknownItem = (index) => {
    // console.log('enter selectUnknownItem, index', index)
    if (index < 0 || index >= this.state.unknownList.length) {
      console.log('selectUnknownItem, invalid index, length is:', this.state.unknownList.length)
      return
    }
    this.setUnknownItem(index)
    this.doSimplifer(this.state.unknownList[index].sentence)
  }

  onDelete = (key) => {
    // console.log('enter onDelete, key:', key)
    this.deleteUnknownItem(this.state.unknownIndex)
  }

  deleteByPicker = () => {
    // console.log('enter deleteByPicker')
    this.deleteUnknownItem(this.state.unknownIndex)
  }

  onRejectSuggestion = () => {
    // console.log( 'enter onRejectSuggestion')
    this.state.acceptSuggestion = false
    this.setState({
      acceptSuggestion: this.state.acceptSuggestion
    })
  }

  addPattern = (newCorpus, labels) => {
    // console.log('add pattern for', newCorpus, labels)
    let that = this
    this.props.dispatch(postPattern({
      pattern: {
        sentence: newCorpus,
        labels: labels
      },
      type: 'positive',
      intentId: this.state.intentId,
      agent: this.state.agent
    }, data => {
      // console.log('add pattern result', data)
      // that.props.getPatternList(that.props, corpusType)
    }))
  }

  render() {
    const style = {
      innerContainer: {
        width: '100%',
        height: '100%',
      },

      itemTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        // paddingLeft: '15px',
        marginBottom: '20px',
        height: '40px',
        lineHeight: '40px'
      },

      unknownList:{
        paddingTop:'10px',
        marginLeft: '20px',
        border: 'none',
        height: '100%',
        overflow: 'auto',
        borderRight: '10px solid #f8f8f8',
      },

      link:{
        marginTop:'10px'
      },

      sentence: {
        fontSize: '16px',
        width: '100%',
        borderBottom: '1px solid #dadada',
        margin: '5px 0'
      }

    }
    const {intentResult} = this.props
    const {unknownList, unknownIndex, suggestion} =this.state
    // console.log('intentResult:', intentResult)
    return (
      <Layout style={{height: '100%'}}>
      <Spin spinning={intentResult.loading} style={{height: '100%'}}>
        <div style={style.innerContainer}>
          <Header>
            <Link style={style.link} to={'/selectService'}>
              <Icon style={{fontWeight:'bold'}} type='left'></Icon>应用选择
            </Link>
          </Header>
          <Content style={{height: '100%'}}>
            <Row style={style.innerContainer}>
              <Col span={4} style={{height: '100%'}}>
                <div style={style.unknownList}>
                  <UnknownItemList
                    items={unknownList}
                    onDelete={this.deleteUnknownItem}
                    onSelect={this.selectUnknownItem}
                  />
                </div>
              </Col>

              <Col span={12} offset={1}>
                {unknownList.length > unknownIndex ?
                  <div style={{height: '100%', overflow: 'auto', marginLeft: '10px'}}>
                    <UnknownPicker
                      sentence={unknownList[unknownIndex].sentence}
                      suggestion={suggestion}
                      acceptSuggestion={this.state.acceptSuggestion}
                      onDelete={this.deleteByPicker}
                      onRejectSuggestion={this.onRejectSuggestion}
                    />
                    <label className="headerTitle">目标意图:</label>
                    <IntentTree intentCollections={[intentResult.data]}
                                onSelect={this.onIntentSelect}
                    />
                  </div>
                  : null}
              </Col>
            </Row>
          </Content>
        </div>
      </Spin>
      </Layout>
    )
  }
}
