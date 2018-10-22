import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link, hashHistory} from 'react-router'
import {Row, Col, Icon, Modal, Button, message, Spin} from 'antd'
import {publishAgent} from 'actions/serve'

@connect((state, props) => ({
    config: state.config
}))

export class AgentTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deleteVisible: false,
            agentName: '',
            agentId: '',
            packageVisible: false,
            publishing: false
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
    };

    hideAddModal = () => {
        this.setState({
            packageVisible: false
        })
    };

    delete = () => {
        this.props.deleteAgent(this.state.agentId)
    }

    editAgent = () => {
        this.props.showEditModal(this.props.agent)
    };

    package = () => {
        message.info('开始部署，可能需要几分钟，请等待');
        this.setState({publishing: true})
        this.props.dispatch(publishAgent({agent: this.props.agent.name, agentId: this.props.agent.agentId}, data => {
            message.info(this.props.agent.name + '升级部署完成')
            this.setState({publishing: false})
        }, error => {
            message.error('部署失败');
            this.setState({publishing: false})
            console.log(error)
        }))
    };

    getAgentState = ()=> {
        const style ={
            borderPre:{
                marginBottom: 0,
                display: 'inline-flex',
                borderLeft: '1px solid #dadada',
                verticalAlign: 'top',
                alignItems: 'center',
                lineHeight: '24px',
                minHeight: '40px',
                paddingLeft: '10px'
            },
            fontSize: {
                lineHeight: '24px',
                paddingLeft: '10px',
                marginBottom: 0,
            }
        }
        if(this.state.publishing){
            return (<div style={style.borderPre}> <Spin/> <p style={style.fontSize}> 发布中 </p></div>)
        }
        return (<p style={style.borderPre}> 已发布</p>)
    };

    toCorpusLabel = () => {
        sessionStorage.setItem('agent', this.props.agent.name)
        hashHistory.push({
            pathname: 'corpusLabel',
        })
    };

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
                paddingLeft: '10px'
            },
            link:{
                textAlign: 'center',
                display: 'block'
            },
            close:{
                position: 'absolute',
                right: '0',
                top: '0',
                width: '24px',
                height: '24px',
                lineHeight: '24px',
                background: '#ddd',
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
            },
            downloadTip:{
                lineHeight: '40px',
                paddingLeft: '40px'
            }
        };

        return (
            <li className="hover-li" style={style.li}>
                <Row style={style.row}>
                    <Col className='bottom-line' style={style.col} xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>应用名称</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.name}</p>
                        </Col>
                    </Col>
                    <Col style={style.col} xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>状态</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            {this.getAgentState()}
                        </Col>
                    </Col>
                </Row>
                <Row style={style.row}>
                    <Col className='bottom-line' style={style.col} xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Col xs={6} sm={8} md={6} lg={4} xl={4}>
                            <span style={style.label}>中文名字</span>
                        </Col>
                        <Col xs={18} sm={18} md={18} lg={20} xl={20}>
                            <p style={style.pre}>{this.props.agent.zhName}</p>
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
                            <p style={style.pre}>
                                {
                                    this.props.agent.shareAgents.length > 0 && this.props.agent.shareAgents.map((item,index) => {
                                        let domon = this.props.agent.shareAgents.length-index==1? '' : ','
                                        return (item.name || item) + domon
                                    })
                                }
                            </p>
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
                        <Link style={style.link} onClick={this.toCorpusLabel}>配置语料</Link>
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
                    <Col onClick={this.package} style={style.col} xs={12} sm={12} md={12} lg={12} xl={6}>
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
                <Modal
                    title="打包提示"
                    visible={this.state.packageVisible}
                    centered
                    onCancel={this.hideDeleteModal}
                    destroyOnClose="true"
                    footer={null}
                    bodyStyle={{padding:0}}
                >
                    {
                        this.state.packageVisible ? <span style={style.downloadTip}>打包完成，现在需要下载？</span> : <span style={style.downloadTip}>打包中...</span>
                    }
                    <div style={style.modalFoot}>
                        <Button onClick={this.hideAddModal}>Cancel</Button>
                        {
                            this.state.packageVisible ? <Button style={style.modalFootBtn} type="primary" onClick={this.hideAddModal}>
                                <a href={this.props.config.linkUrl + '/package/' + this.props.agent.name + '.zip'}>下载</a>
                            </Button> : <Button style={style.modalFootBtn}>
                                <a href="javascript:void(0)">下载</a>
                            </Button>
                        }
                    </div>
                </Modal>
            </li>
        )
    }
}
