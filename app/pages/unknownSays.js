import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form, Row, Col} from 'antd'
import {
  fetchintent
} from 'actions/intent'

import {unknownList} from 'actions/unknown'

import {UnknownItem, UnknownItemList, IntentTree} from "components/index";
import {intentResult} from "../reducers/intent";

let agent = '';

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
      backlog:[]
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
      var dummy = {
          sentence: '我是未识别语料'
      }
      if (!this.state.unknownList.length) {
        this.state.unknownList.push(dummy)
        this.state.unknownList.push(dummy)
        this.state.unknownList.push(dummy)
        this.state.unknownList.push(dummy)
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

  onSelect = (value) => {
    console.log('onSelect, item: ',value);
    if (value) {
      this.setState({
        intentId:value
      })
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
  onPick = (key) => {
    console.log('enter onPick, key:', key)
    // this.props.dispatch(postCorpus(obj, data => {
    //     // this.props.dispatch(unknownList('?agent=' + agent, data => {
    //     // }, error => {
    //     //     console.log(error)
    //     // }));
    // }))
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
        paddingLeft: '15px',
        marginBottom: '0px',
        lineHeight: '40px'
      },

      unknownList:{
        marginTop:'10px'
      },

      link:{
        marginTop:'10px'
      }
      // innerBox: {
      //     height: '100%'
      // },
      // headerStyle:{
      //     background: '#0099CC',
      // },
      // body: {
      //     width: '80%'
      // }
    }
    return (
      <Spin spinning={intentResult.loading}>
        <div style={style.innerContainer}>
          <Link className='bread-cruft' style={style.link} to={'/selectService'}>
            <Icon style={{fontWeight:'bold'}} type='left'></Icon>应用选择
          </Link>
          <Row>
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
              <div>
                <label style={style.itemTitle}>未识别语料:</label>
                <UnknownItem
                  content={unknownList.length > unknownIndex && unknownList[unknownIndex].sentence}
                  index={unknownIndex}
                  intentId={intentId}
                  deleteMe={this.onDelete}
                  pickMe={this.onPick}
                />

              </div>
              <IntentTree intentCollections={[intentResult.data]}
                          onSelect={this.onSelect}
              />
            </Col>
          </Row>
        </div>
      </Spin>

    )
  }
}
