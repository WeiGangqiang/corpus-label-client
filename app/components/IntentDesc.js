import React, {Component} from 'react';
import {Modal, Form, Input, Button, Checkbox, Col, Row, message} from 'antd'

const FormItem = Form.Item;

@Form.create({
    onFieldsChange(props, items) {
    },
})

export class IntentDesc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editIntentVisible: false,
            parameters: [],
            defaultValue: [],
            checkBoxArray: []
        }
    }


    getTitle = () => {
        const subtitleCss = {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '0px',
            lineHeight: '40px'
        }
        return <div><span onClick={this.ShowEditMode} className="add-new-button">编辑</span><p style={subtitleCss}> 基本信息 </p></div>
    };

    onChange = (value) => {
        this.setState({
            checkBoxArray: value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let parameters = []
                this.state.checkBoxArray.map(item => {
                    parameters.push(this.state.parameters[item])
                });
                let param = {
                    "intent": {
                        "intentId": this.props.intentId,
                        "name": values.name,
                        "zhName": values.zhName,
                        "modelPath": this.props.modelPath,
                        "parameters": parameters
                    }
                }
                this.props.editIntent(param);
                this.hideEditModal()
            }
        });
    };

    ShowEditMode = () => {
        if(this.props.intentId && this.props.mode != 'local'){
            let parameters = [], defaultValue = [];
            this.props.entityParam.map((item,index) => {
                defaultValue.push(index)
                let {name, label, entity, isList} = item;
                parameters.push({name, label, entity, isList})
            });

            this.props.entityList[0].children.map((item,index) => {
                let a = this.props.entityParam.find(entity => entity.name == item.key)
                if(!a){
                    parameters.push({
                        name: item.key,
                        label: 'L' + parameters.length,
                        entity: item.key,
                        isList: false
                    })
                }
            });
            this.setState({
                editIntentVisible: true,
                parameters: parameters,
                defaultValue: defaultValue
            })
        }else{
            message.info('此意图不可编辑')
        }

    };
    hideEditModal = () => {
        this.setState({
            editIntentVisible: false
        })
    }

    render() {
        const style = {
            baseInfo: {
                height: 'auto',
                background: '#fbfbfb',
                padding: '0 15px',
                fontSize: '14px',
                marginBottom: '15px',
                borderRadius: '15px'
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

        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };

        return (
            <div>
                <Row style={style.baseInfo}>
                    {this.getTitle()}
                    <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                        <span style={style.span} xs={6}>意图名字:</span>
                        <div xs={18}>{this.props.name}</div>
                    </Col>
                    <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                        <span style={style.span} xs={6}>中文名字:</span>
                        <div xs={18}>{this.props.zhName}</div>
                    </Col>
                    <Col style={style.col} span={4} xs={24} sm={12} xl={4}>
                        <span style={style.span} xs={6}>类型:</span>
                        <div xs={18}>{this.props.mode}</div>
                    </Col>
                    <Col style={style.col} span={24} xs={24} sm={24}>
                        <span style={style.span} xs={6}>模型路径:</span>
                        <div xs={18}>{this.props.modelPath}</div>
                    </Col>
                </Row>
                <Modal
                    title='编辑'
                    visible={this.state.editIntentVisible}
                    centered
                    destroyOnClose="true"
                    footer={null}
                    onCancel={this.hideEditModal}
                    bodyStyle={{padding:0}}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem className="modalFormItem"
                                  {...formItemLayout}
                                  label="意图名字"
                                  colon={false}
                        >
                            {getFieldDecorator('name', {
                                rules: [
                                    {required: true, message: '请输入意图名字'},
                                    {
                                        pattern: /^[0-9a-zA-Z-\u4E00-\u9FFF]+$/,
                                        message: '不能有非法字符串'
                                    }
                                ],
                                initialValue: this.props.name
                            })(<Input
                                placeholder="请输入意图名字"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem className="modalFormItem"
                                  {...formItemLayout}
                                  label="中文名"
                                  colon={false}
                        >
                            {getFieldDecorator('zhName', {
                                rules: [
                                    {required: true, message: '请输入中文名'}
                                ],
                                initialValue: this.props.zhName
                            })(<Input
                                placeholder="请输入中文名"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem className="modalFormItem"
                                  {...formItemLayout}
                                  label="parameters"
                                  colon={false}
                        >
                            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} defaultValue={this.state.defaultValue}>
                                <Row>
                                    {
                                        this.state.parameters.map((item,index) => {
                                            return <Col key={index} span={8}><Checkbox value={index}>{item.name}</Checkbox></Col>
                                        })
                                    }
                                </Row>
                            </Checkbox.Group>
                        </FormItem>
                        <FormItem>
                            <div style={style.modalFoot}>
                                <Button onClick={this.hideEditModal}>Cancel</Button>
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