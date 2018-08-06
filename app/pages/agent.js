
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { hashHistory, Link } from 'react-router'
import { Spin, message, Form, Icon, Input, Button, Row, Col,Table } from 'antd'
import { fetchServe, fetchAgent, setAgentName } from 'actions/serve'

const FormItem = Form.Item

@connect((state, props) => ({
  config: state.config,
  serveResult: state.serveResult,
  agentResult: state.agentResult,
}))
@Form.create({
    onFieldsChange(props, items) {
    },
})

export default class Agent extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            loading: false,
          servePath:'',
          serveId:1,
          agentId:1,
        }
    }

    componentDidMount() {
        // this.props.dispatch(fetchServe('',data=>{
        //     console.log(data)
        // },error=>{
        //     console.log(error)
        // }))
      this.props.dispatch(fetchAgent('?host=http://127.0.0.1',data => {
        console.log(data);
      }, error => {
        console.log(error)
      }))
    }

    // selectServe(obj) {
    //     this.setState({
    //       servePath: obj.path,
    //       serveId: obj.id,
    //     });
    //     sessionStorage.setItem('servepath',obj.path);
    //     if(this.state.agentPath){
    //       hashHistory.push('/intendList')
    //     }
    // }

  selectAgent(obj) {
        this.setState({
          agentId: obj.id,
        });
        sessionStorage.setItem('agentName',obj.name);
    hashHistory.push('/intendList')
  }

    render() {
        const { getFieldDecorator } = this.props.form

        const { serveResult, agentResult } = this.props;

        console.log(agentResult)

        const style={

            container:{
                background:'#fff',
              width: '90%',
              padding: '20px',
            },
            flexBox:{
                display:'flex',
                flexWrap:'wrap',
                justifyContent:'space-start'
            },
            serveLi:{
                border:'1px solid #dadada',
                borderRadius:'5px',
                padding:'5px 10px',
                fontSize:'14px',
                marginBottom:'10px',
                marginRight:'10px',
              cursor: 'pointer',
            },
          agentHead:{
              lineHeight: '40px',
          }
        }
        return (
            <Spin spinning={agentResult.loading}>
              {!agentResult.loading ? <div style={style.container} className="container">
                {/*<div>服务器列表</div>*/}
                {/*<ul style={style.flexBox}>*/}
                  {/*{serveResult.data.map(item=>{*/}
                    {/*return <li className={item.id==this.state.serveId? 'active-btn':''} style={style.serveLi} key={item.id} onClick={this.selectServe.bind(this,item)}>{item.name}</li>*/}
                  {/*})}*/}
                {/*</ul>*/}
                <div style={style.agentHead}>机器人列表</div>
                <ul style={style.flexBox}>
                  {
                    agentResult.data.map( item => {
                      return <li  className={item.id==this.state.agentId? 'active-btn':''} style={style.serveLi} key={item.id} onClick={this.selectAgent.bind(this,item)}>{item.name}</li>
                    })
                  }
                </ul>
              </div> : <div>数据正在加载中，您可以先去嗑瓜子</div>}
            </Spin>
        )
    }
}
