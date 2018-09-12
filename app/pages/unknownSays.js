import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form, Row, Col, Layout} from 'antd'

import {UnknownItem, UnknownItemList, IntentTree} from "components/index";
import {Simplifier} from 'components/Simplifer'

import {fetchintent, postPattern, predict} from 'actions/intent'
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
      simpliferSequence: 0
    };
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
      if (!this.state.unknownList.length) {
        var step;
        for (step = 0; step < 5; step++) {
          var dummy = {
            sentence: ''
          }
          dummy.sentence = '我是未识别语料' + step
          this.state.unknownList.push(dummy)
        }
      }
      this.setState({
        unknownList: this.state.unknownList
      })
      console.log('unknownList fetched:', this.state.unknownList)
    }, error => {
      console.log(error)
    }));

    this.props.dispatch(unknownList('?agent=' + agent, data => {
      this.state.backlog = [...data]

      //TODO for test, should be removed
      // var dummy = {
      //   sentence: '我是backlog语料'
      // }
      // if (!data.length) {
      //   this.state.backlog.push(dummy)
      //   this.state.backlog.push(dummy)
      //   this.state.backlog.push(dummy)
      //   this.state.backlog.push(dummy)
      // }

      this.setState({
        backlog: this.state.backlog
      })
      console.log('backlog fetched:', this.state.backlog)
    }, error => {
      console.log(error)
    }));
  }

  onIntentSelect = (value) => {
    console.log('onIntentSelect, intent id: ',value);
    if (value) {
      this.state.intentId = value
      // onIntentSelect()
      console.log('onIntentSelect, intent id: ',this.state.intentId);
      let labels = []
      this.setState({
        intentId: this.state.intentId
      })
      if (this.state.unknownList.length > this.state.unknownIndex) {
        this.addPattern(this.state.unknownList[this.state.unknownIndex].sentence, labels)
        this.deleteUnknownItem(this.state.unknownIndex)
        this.state.unknownIndex = 0
        this.setState({
          unknownIndex: this.state.unknownIndex
        })
      }
    }
  }

  deleteUnknownItem = (index) => {
    console.log('enter deleteUnknownItem, index:', index)
    if (index < 0 || index >= this.state.unknownList.length) {
        return
    }
    this.state.unknownList.splice(index, 1);

    if (this.state.backlog.length > 0) {
      this.state.unknownList.push(this.state.backlog[0])
      this.state.backlog.shift()
    } else {
      this.props.dispatch(unknownList('?agent=' + agent, data => {
        // this.setState({
        //   backlog: [...data]
        // })
        console.log('backlog fetched:', data)
        if (data.length > 0) {
          this.state.unknownList.push(data[0])
          data.shift()
        }
        this.state.backlog = [...data]
      }, error => {
        console.log(error)
      }));
    }
    this.setState({
      unknownList:this.state.unknownList,
      backlog:this.state.backlog
    })
  }

  selectUnknownItem = (index) => {
    console.log('enter selectUnknownItem')
    if (!index || index < 0 || index >= this.state.unknownList.length) {
      return
    }
    this.setState({
      unknownIndex: index
    })
  }

  onDelete = (key) => {
    // console.log('enter onDelete, key:', key)
    this.deleteUnknownItem(this.state.unknownIndex)
  }

  addPattern = (newCorpus, labels) => {
    console.log('add pattern for', newCorpus, labels)
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

  addPatternWithPredict = (sentence) => {
    console.log('enter addPatternWithPredict, sentence:', sentence)
    let that = this
    this.props.dispatch(predict({
      "sentence": sentence,
      "intentId": this.state.intentId,
      "agent": this.state.agent
    }, data => {
      // console.log('predict labels is', data)
      that.addPattern(sentence, data)
    }, error => {
      console.log(error)
    }))
    this.setState({
      simpliferSequence: this.state.simpliferSequence+1
    })
  }

  onPick = (key) => {
    console.log('enter onPick, key:', key)
    // addPattern()
  }

  render() {
    const {intentResult} = this.props
    const {unknownList, unknownIndex, intentId} =this.state
    const style = {
      innerContainer: {
        width: '100%',
        height: '100%',
        paddingTop: '10px',
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
        marginTop:'10px'
      },

      link:{
        marginTop:'10px'
      },

      sentence: {
        fontSize: '16px',
        width: '100%',
        borderBottom: '1px solid #dadada'
      }

    }
    console.log('intentResult:', intentResult)
    return (
      <Layout>
      <Spin spinning={intentResult.loading}>
        <div style={style.innerContainer}>
          <Header>
            <Link style={style.link} to={'/selectService'}>
              <Icon style={{fontWeight:'bold'}} type='left'></Icon>应用选择
            </Link>
          </Header>
          <Content>
            <Row style={style.innerContainer}>
              <Col span={4} offset={1}>
                <div style={{height: '100%', overflow: 'auto'}}>
                  <div className="container" style={style.unknownList}>
                    <UnknownItemList
                      items={unknownList}
                      onDelete={this.deleteUnknownItem}
                      onSelect={this.selectUnknownItem}
                    />
                  </div>
                </div>
              </Col>
              <Col span={12} offset={1}>
                <div style={{height: '100%', overflow: 'auto'}}>
                  <label className="headerTitle">标注语料:</label>
                  <p style={style.sentence}> {unknownList.length > unknownIndex && unknownList[unknownIndex].sentence} </p>

                </div>
                <IntentTree intentCollections={[intentResult.data]}
                            onSelect={this.onIntentSelect}
                />
              </Col>
            </Row>
          </Content>
        </div>
      </Spin>
      </Layout>
    )
  }
}
