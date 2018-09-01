import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory, Link} from 'react-router'
import {Spin, message, Form, Icon, Input, Button, Row, Col, Table, Modal, Checkbox} from 'antd'
import {fetchServe, fetchAgent, setAgentName, deleteAgent, addAgent, updateAgent} from 'actions/serve'

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
            addVisible: false,
            shareAgents: [],
            newAgent: '',
            newGateWay: '',
            newIntroduced: '',
            newUnknown: '',
            editOrAdd: ''
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
            addVisible: true,
            editOrAdd: 'add'
        })
    }

    hideAddModal = () => {
        this.setState({
            addVisible: false,
            shareAgents: [],
            newAgent: '',
            newGateWay: '',
            newIntroduced: '',
            newUnknown: '',
            agentId: '',
            editOrAdd: ''
        })
    }

    showEditAgent = (agent) => {
        this.setState({
            shareAgents: agent.shareAgents,
            newAgent: agent.name,
            newGateWay: agent.gateWay,
            newIntroduced: agent.introduced,
            newUnknown: agent.unknownReplies.join(';'),
            agentId: agent.agentId,
            addVisible: true,
            editOrAdd: 'edit',

        })
    }

    addAgent = () => {

    }

    onChange = (value) => {
        this.setState({
            shareAgents: value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                // console.log(this.state.shareAgents)
                if (this.state.editOrAdd == 'add'){
                    this.props.dispatch(addAgent({
                        name: values.agentName,
                        gateWay: values.gateWay,
                        introduced: values.introduce,
                        shareAgents: this.state.shareAgents,
                        unknownReplies: values.unknown.replace(/；/g,";").split(';')
                    }, data => {
                        console.log(data)
                        this.hideAddModal()
                        this.props.dispatch(fetchAgent('', data => {
                            // console.log(data);
                        }, error => {
                            console.log(error)
                        }))
                    }, error => {
                        console.log(error)
                    }))
                } else if (this.state.editOrAdd == 'edit') {
                    this.props.dispatch(updateAgent({
                        name: values.agentName,
                        gateWay: values.gateWay,
                        introduced: values.introduce,
                        shareAgents: this.state.shareAgents,
                        unknownReplies: values.unknown.replace(/；/g,";").split(';'),
                        agentId: this.state.agentId
                    }, data => {
                        this.hideAddModal()
                        this.props.dispatch(fetchAgent('', data => {
                            // console.log(data);
                        }, error => {
                            console.log(error)
                        }))
                    }, error => {
                        console.log(error)
                    }))
                }

            }
        });
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
                marginTop: '-40px',
                borderBottom: '1px solid #dadada',
                marginBottom: '10px'
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
            },
            modalFoot:{
                height: '52px',
                lineHeight: '32px',
                textAlign: 'right',
                padding: '10px 16px',
                borderTop: '1px solid #e8e8e8'
            },
            modalFootBtn:{
                marginLeft: '8px'
            }
        }
        return (
            <div style={{marginTop:'55px',height: '100%'}}>
                <div className='bread-cruft' ><img style={{height: '100%'}} src="images/logo.png" alt=""/></div>
                <div className="container-of-index">
                    <ul className="slideBar-of-index">
                        <div>操作</div>
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
                                            return <AgentTable agent={item} key={item.agentId} deleteAgent={this.deleteAgent} showEditModal={this.showEditAgent}/>
                                        })
                                    }
                                </ul>
                            </div>

                        </div> : <div>数据正在加载中，您可以先去嗑瓜子</div>}
                    </Spin>
                </div>
                <Modal
                    title={this.state.editOrAdd == 'add'? '新增' : '编辑'}
                    visible={this.state.addVisible}
                    centered
                    destroyOnClose="true"
                    footer={null}
                    onCancel={this.hideAddModal}
                    bodyStyle={{padding:0}}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem className="modalFormItem">
                            {getFieldDecorator('agentName', {
                                rules: [
                                    {required: true, message: '请输入应用名字'},
                                    {
                                        pattern: /^[0-9a-zA-Z\u4E00-\u9FFF]+$/,
                                        message: '不能有非法字符串'
                                    }
                                ],
                                initialValue: this.state.newAgent
                            })(<Input
                                placeholder="请输入应用名字"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem className="modalFormItem">
                            {getFieldDecorator('gateWay', {
                                rules: [
                                    {required: true, message: '请输入网关地址'}
                                ],
                                initialValue: this.state.newGateWay
                            })(<Input
                                placeholder="请输入网关地址"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem className="modalFormItem">
                            {getFieldDecorator('introduce', {
                                rules: [
                                    {required: true, message: '请输入应用简介'},
                                ],
                                initialValue: this.state.newIntroduced
                            })(<Input
                                placeholder="请输入应用简介"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem className="modalFormItem">
                            <span>依赖的应用:</span>
                            <Checkbox.Group style={{ width: '100%' }} defaultValue={this.state.shareAgents} onChange={this.onChange}>
                                <Row>
                                    {
                                        agentResult.data.map(item => {
                                            return item.name == this.state.newAgent ? '' : <Col key={item.agentId} span={8}><Checkbox value={item.name}>{item.name}</Checkbox></Col>
                                        })
                                    }
                                </Row>
                            </Checkbox.Group>
                        </FormItem>
                        <FormItem className="modalFormItem">
                            <span>未识别回复:</span>
                            {getFieldDecorator('unknown', {
                                initialValue: this.state.newUnknown
                            })(<TextArea style={{resize: 'none',height: '90px'}} placeholder="请输入未知回复语"/>)}
                            <span style={{color:'#aaa'}}>如设置多条，中间用分号（；）隔开</span>
                        </FormItem>
                        <FormItem>
                            <div style={style.modalFoot}>
                                <Button onClick={this.hideAddModal}>Cancel</Button>
                                <Button style={style.modalFootBtn} type="primary" htmlType="submit">
                                    OK
                                </Button>
                            </div>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
