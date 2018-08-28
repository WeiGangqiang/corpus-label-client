import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory, Link} from 'react-router'
import {Spin, message, Form, Icon, Input, Button, Row, Col, Table, Modal, Checkbox} from 'antd'
import {fetchServe, fetchAgent, setAgentName, deleteAgent, addAgent} from 'actions/serve'

import {AgentTable} from "components/index";

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
            servePath: '',
            serveId: 1,
            agentId: 1,
            addVisible: false
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchAgent('', data => {
            // console.log(data);
        }, error => {
            console.log(error)
        }))
    }

    deleteAgent = (agentId) => {
        console.log(agentId)
        this.props.dispatch(deleteAgent('?agentId=' + agentId ,data => {
            this.props.dispatch(fetchAgent('', data => {
                // console.log(data);
            }, error => {
                console.log(error)
            }))
        }, error => {
            console.log(error)
        }))
    }

    showAddAgent = () => {
        this.setState({
            addVisible: true
        })
    }

    hideAddModal = () => {
        this.setState({
            addVisible: false
        })
    }

    addAgent = () => {

    }

    onChange = (value) => {
        console.log(value)
    }

    submit = () => {

    }

    render() {
        const {getFieldDecorator} = this.props.form

        const { TextArea } = Input

        const {agentResult} = this.props;

        const style = {

            container: {
                background: '#fff',
                width: '740px',
                padding: '0 20px',
                height: '100%',
                paddingTop: '40px'
            },
            flexBox: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-start',
                marginBottom: '60px'
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
            agentHead: {
                lineHeight: '40px',
                marginTop: '-40px'
            },
            addApp:{
                float:'right',
                background: '#188ae2',
                color: '#fff',
                borderRadius: '5px',
                width: '90px',
                height: '32px',
                lineHeight: '32px',
                textAlign: 'center',
                marginTop: '4px',
                cursor: 'pointer'
            }
        }
        return (
            <div style={{marginTop:'55px',height: '100%'}}>
                <div className='bread-cruft' ><img style={{height: '100%'}} src="images/logo.png" alt=""/></div>
                <div className="container-of-index">
                    <ul className="slideBar-of-index">
                        <li>操作</li>
                        <li>我的应用</li>
                        <li>公共应用</li>
                        <li>帮助文档</li>
                    </ul>
                    <Spin spinning={agentResult.loading} className="content-of-index">
                        {!agentResult.loading ? <div style={style.container} className="container">
                            <div style={style.agentHead}>
                                <span>我的应用</span>
                                <span onClick={this.showAddAgent} style={style.addApp}><Icon type="plus"></Icon>添加应用</span>
                            </div>
                            <div style={{height: '100%', overflow: 'auto'}}>
                                <ul style={style.flexBox}>
                                    {
                                        agentResult.data.map(item => {
                                            return <AgentTable agent={item} key={item.agentId} deleteAgent={this.deleteAgent}/>
                                        })
                                    }
                                </ul>
                            </div>
                        </div> : <div>数据正在加载中，您可以先去嗑瓜子</div>}
                    </Spin>
                </div>
                <Modal
                    title="新增"
                    visible={this.state.addVisible}
                    destroyOnClose="true"
                    onCancel={this.hideAddModal}
                    onOk={this.submit}
                >
                    <Form onSubmit={this.submit}>
                        <FormItem>
                            {getFieldDecorator('agentName', {
                                rules: [
                                    {required: true, message: '请输入应用名字'},
                                ],
                            })(<Input
                                placeholder="请输入应用名字"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('gateWay', {
                                rules: [
                                    {required: true, message: '请输入网关地址'},
                                ],
                            })(<Input
                                placeholder="请输入网关地址"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('introduce', {
                                rules: [
                                    {required: true, message: '请输入应用简介'},
                                ],
                            })(<Input
                                placeholder="请输入应用简介"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem>
                            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                                <Row>
                                    <Col span={8}><Checkbox value="A">A</Checkbox></Col>
                                    <Col span={8}><Checkbox value="B">B</Checkbox></Col>
                                    <Col span={8}><Checkbox value="C">C</Checkbox></Col>
                                    <Col span={8}><Checkbox value="D">D</Checkbox></Col>
                                    <Col span={8}><Checkbox value="E">E</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('unknown', {
                            })(<TextArea placeholder="请输入未知回复语，用分号(;)隔开"/>)}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
