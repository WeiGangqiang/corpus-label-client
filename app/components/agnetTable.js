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
        console.log(this.props.agent)
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

    render() {
        const style = {
            li:{
                borderLeft: '1px solid #dadada',
                borderTop: '1px solid #dadada',
                width: '100%',
                marginBottom: '30px',
                position: 'relative'
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
                width: '90px',
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
            <li style={style.li}>
                <Row style={style.row}>
                    <Col style={style.col} span={12}>
                        <span style={style.label}>name</span><pre style={style.pre}>{this.props.agent.name}</pre>
                    </Col>
                    <Col style={style.col} span={12}>
                        <span style={style.label}>zhName</span><pre style={style.pre}>{this.props.agent.zhName}</pre>
                    </Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col} span={12}><span style={style.label}>ID</span><pre style={style.pre}>{this.props.agent.agentId}</pre></Col>
                    <Col style={style.col} span={12}><span style={style.label}>网关</span><pre style={style.pre}>{this.props.agent.gateWay}</pre></Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col} span={24}><span style={style.label}>介绍语</span><pre style={style.pre}>{this.props.agent.agentId}</pre></Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col} span={24}><span style={style.label}>依赖</span><pre style={style.pre}>{this.props.agent.shareAgents.join(',')}</pre></Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col} span={24}><span style={style.label}>未识别回复</span><pre style={style.pre}>{this.props.agent.unknownReplies.join('\n')}</pre></Col>
                </Row>
                <Row style={style.row}>
                    <Col style={style.col} span={8}>
                        <Link style={style.link} to={{
                            pathname: '/intendList',
                            search: '?agent=' + this.props.agent.name,
                        }}>配置语料</Link>
                    </Col>
                    <Col style={style.col} span={8}>
                        <Link style={style.link} to={{
                            pathname: '/unknown',
                            search: '?agent=' + this.props.agent.name
                        }}>未识别语料</Link>
                    </Col>
                    <Col style={style.col} span={8}>
                        <Link style={style.link}>发布</Link>
                    </Col>
                </Row>
                <Icon onClick={this.showDeleteModal} style={style.close} type='close'></Icon>
                <Modal
                    title="删除提示"
                    visible={this.state.deleteVisible}
                    onOk={this.delete}
                    onCancel={this.hideDeleteModal}
                >
                    确定删除{this.state.agentName}应用？
                </Modal>
            </li>
        )
    }
}