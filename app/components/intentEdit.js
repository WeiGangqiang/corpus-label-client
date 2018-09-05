import React, {Component} from 'react'
import {Modal, Form, Input, Button, Checkbox, Col, Row} from 'antd'

const FormItem = Form.Item;

@Form.create({
    onFieldsChange(props, items) {
    },
})

export class IntentEdit extends Component{
    constructor (props) {
        super(props)
        this.state = {
            parameters: []
        }
    }



    hideAddModal = () => {

    };

    onChange = (value) => {
        let parameters=[];
        for(let i=0;i<value.length;i++){
            parameters.push(this.props.entityArray[value[i]])
        }
        this.setState({
            parameters: parameters
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                console.log(this.state.parameters)
            }
        });
    };

    entityArr = () => {

    };


    render() {
        const {getFieldDecorator} = this.props.form;

        const style = {
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
            <Modal
                title='编辑'
                visible={this.props.editIntentVisible}
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
                            initialValue: ''
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
                            initialValue: ''
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
                            initialValue: ''
                        })(<Input
                            placeholder="请输入应用简介"
                            type="text"
                        />)}
                    </FormItem>
                    <FormItem className="modalFormItem">
                        <span>依赖的应用:</span>
                        <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} defaultValue={this.props.defaultValue}>
                            <Row>
                                {
                                    this.props.entityArray&&this.props.entityArray.map((item,index) => {
                                        return <Col key={index} span={8}><Checkbox value={index}>{item.name}</Checkbox></Col>
                                    })
                                }
                            </Row>
                        </Checkbox.Group>
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
        )
    }
}