import React, {Component} from 'react';
import { Form, Input, Col, Row, message, Icon, Modal} from 'antd'


@Form.create({
    onFieldsChange(props, items) {
    },
})

export class IntentDesc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editState: false,
            deleteVisible: false,
            name: '',
            zhName: ''
        }
    }


    getTitle = () => {
        const style = {
            subtitleCss: {
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '0px',
                lineHeight: '55px'
            },
            box:{
                padding: '0 15px'
            }
        };
        return <div style={style.box}>
            {
                this.state.editState ? <Icon type="save" onClick={this.editBaseMsg}  className='edit-icon'/> :  <Icon onClick={this.editBaseMsg} className='edit-icon' type="edit"/>
            }
            <Icon type='delete' className='edit-icon' onClick={this.showDeleteModal}></Icon>
            <p style={style.subtitleCss}> 基本信息 </p>
        </div>
    };

    showDeleteModal = () => {
        if(this.props.mode != 'local'){
            this.setState({
                deleteVisible: true
            })
        }else{
            message.info('由于该意图mode值为local，不允许删除')
        }

    };

    hideDeleteModal = () => {
        this.setState({
            deleteVisible: false
        })
    };

    delete = () => {
        this.props.deleteIntent(this.props.intentId);
        this.hideDeleteModal()
    };
    editBaseMsg = () => {
        if(this.state.editState){
            let param = {
                "intent": {
                    "intentId": this.props.intentId,
                    "name": this.state.name,
                    "zhName": this.state.zhName,
                    "modelPath": this.props.modelPath
                }
            };
            this.props.editIntent(param, {
                name: this.state.name,
                zhName: this.state.zhName,
                intentId: this.props.intentId,
                modelPath: this.props.modelPath
            });
            this.setState({
                editState: !this.state.editState
            })
        }else{
            if(this.props.intentId && this.props.mode != 'local'){
                this.setState({
                    editState: !this.state.editState,
                    name: this.props.name,
                    zhName: this.props.zhName
                })
            }else{
                message.info('此意图不可编辑')
            }
        }
    };
    nameBlur = (e) => {
        this.setState({
            name: e.target.value
        })
    };
    zhNameBlur = (e) => {
        this.setState({
            zhName: e.target.value
        })
    };

    render() {
        const style = {
            baseInfo: {
                height: 'auto',
                background: '#fbfbfb',
                fontSize: '14px',
                marginBottom: '15px',
                borderRadius: '15px'
            },
            baseInfoInner:{
                padding: '0 15px',
            },
            col: {
                lineHeight: '40px',
                paddingLeft: '70px'
            },
            span: {
                float: 'left',
                width: '70px',
                marginLeft: '-70px'
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
        };

        return (
            <div>
                <Row style={style.baseInfo}>
                    {this.getTitle()}
                    <div style={style.baseInfoInner}>
                        <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                            <span style={style.span}>意图名字:</span>
                            <div>
                                {
                                    this.state.editState? <Input defaultValue={this.props.name} onBlur={this.nameBlur}/> : this.props.intentId ? this.props.name : ''
                                }</div>
                        </Col>
                        <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                            <span style={style.span}>中文名字:</span>
                            <div>
                                {
                                    this.state.editState? <Input defaultValue={this.props.zhName} onBlur={this.zhNameBlur}/> : this.props.zhName
                                }
                            </div>
                        </Col>
                        <Col style={style.col} span={4} xs={24} sm={12} xl={4}>
                            <span style={style.span}>类型:</span>
                            <div>{this.props.mode}</div>
                        </Col>
                        <Col style={style.col} span={24} xs={24} sm={24}>
                            <span style={style.span}>模型路径:</span>
                            <div>{this.props.intentId ? this.props.modelPath : ''}</div>
                        </Col>
                    </div>
                </Row>
                <Modal
                    title="删除提示"
                    visible={this.state.deleteVisible}
                    centered
                    onOk={this.delete}
                    onCancel={this.hideDeleteModal}
                >
                    确定删除{this.props.name}意图,他的子意图也会被删掉，确定删除吗？
                </Modal>
            </div>
        )
    }
}