import React, {Component} from 'react';
import {Link} from 'react-router'
import {Row, Col, Icon, Modal} from 'antd'

export class AgentTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deleteVisible: false,
            agentName: '',
            agentId: ''
        }
    }

    showDeleteModal = () => {
        this.setState({
            deleteVisible: true,
            agentId: this.props.agent.agentId,
            agentName: this.props.agent.name
        })
    }

    hideDeleteModal = () => {
        this.setState({
            deleteVisible: false,
            agentName: '',
            agentId: ''
        })
    }

    delete = () => {
        this.props.deleteAgent(this.state.agentId)
    }

    editAgent = () => {
        this.props.showEditModal(this.props.agent)
    }

    render() {

        const style = {
            li:{
                borderLeft: '1px solid #dadada',
                borderTop: '1px solid #dadada',
                width: '99%',
                marginBottom: '30px',
                position: 'relative',
                marginTop: '5px',
                boxShadow: '0 0 5px 0 #bbb'
            },
            row:{
                borderBottom: '1px solid #dadada',
                lineHeight: '40px',
            },
            col:{
                borderRight: '1px solid #dadada'
            },
            label:{
                display: 'inline-block',
                width: '100%',
                textAlign: 'center',
                verticalAlign: 'top'
            },
            pre:{
                marginBottom: 0,
                display: 'inline-flex',
                borderLeft: '1px solid #dadada',
                verticalAlign: 'top',
                alignItems: 'center',
                lineHeight: '24px',
                minHeight: '40px',
                paddingLeft: '5px'
            },
            link:{
                textAlign: 'center',
                display: 'block'
            },
            close:{
                position: 'absolute',
                right: '0',
                top: '0',
                width: '20px',
                height: '20px',
                lineHeight: '20px',
                background: '#ddd',
                cursor: 'pointer'
            }
        };

        return (
            <li className="hover-li" style={style.li}>
                <Row style={style.row}>
                    <Col className='bottom-line' style={style.col} xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>name</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.name}</p>
                        </Col>
                    </Col>
                    <Col style={style.col} xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>中文名字</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.zhName}</p>
                        </Col>
                    </Col>
                </Row>
                <Row style={style.row}>
                    <Col className='bottom-line' style={style.col} xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>ID</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.agentId}</p>
                        </Col>
                    </Col>
                    <Col style={style.col} xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>网关</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.gateWay}</p>
                        </Col>
                    </Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>介绍语</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.introduced}</p>
                        </Col>
                    </Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>依赖</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.shareAgents.join(',')}</p>
                        </Col>
                    </Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>未识别回复</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.unknownReplies.join(';')}</p>
                        </Col>
                    </Col>
                </Row>
                <Row style={style.row}>
                    <Col className='bottom-line' style={style.col} xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Link style={style.link} to={{
                            pathname: '/intentList',
                            search: '?agent=' + this.props.agent.name,
                        }}>配置语料</Link>
                    </Col>
                    <Col className='bottom-line' style={style.col} xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Link style={style.link} to={{
                            pathname: '/unknown',
                            search: '?agent=' + this.props.agent.name
                        }}>未识别语料</Link>
                    </Col>
                    <Col style={style.col} xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Link onClick={this.editAgent} style={style.link}>
                            编辑应用
                        </Link>
                    </Col>
                    <Col style={style.col} xs={12} sm={12} md={12} lg={12} xl={6}>
                        <Link style={style.link}>发布</Link>
                    </Col>
                </Row>
                <Icon onClick={this.showDeleteModal} style={style.close} type='close'></Icon>
                <Modal
                    title="删除提示"
                    visible={this.state.deleteVisible}
                    centered
                    onOk={this.delete}
                    onCancel={this.hideDeleteModal}
                >
                    确定删除{this.state.agentName}应用？
                </Modal>
            </li>
        )
    }
}
