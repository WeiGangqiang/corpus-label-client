import React, {Component} from 'react'
import {Modal, Form, Input, Button} from 'antd'

const FormItem = Form.Item;

@Form.create({
    onFieldsChange(props, items) {
    },
})

export class EditEntity extends Component{
    constructor (props) {
        super(props)
    }

    hideAddModal = () => {
        this.props.hideAddEntity()
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.handleEntitySubmit({
                    entity: {
                        name: values.name,
                        items: [values.items.replace(/，/g, ',')]
                    }
                })
                this.hideAddModal()
            }
        });
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
                title="新增"
                visible={this.props.entityAddVisible}
                centered
                destroyOnClose="true"
                footer={null}
                onCancel={this.hideAddModal}
                bodyStyle={{padding:0}}
            >
                <Form onSubmit={this.handleSubmit}>
                    <FormItem className="modalFormItem">
                        {getFieldDecorator('name', {
                            rules: [
                                {required: true, message: '请输入实体名字'},
                                {
                                    pattern: /^[0-9a-zA-Z-\u4E00-\u9FFF]+$/,
                                    message: '不能有非法字符串'
                                }
                            ]
                        })(<Input
                            placeholder="请输入实体名字"
                            type="text"
                        />)}
                    </FormItem>
                    <FormItem className="modalFormItem">
                        {getFieldDecorator('items', {
                            rules: [
                                {
                                    pattern: /^[0-9a-zA-Z-\u4E00-\u9FFF,]+$/,
                                    message: '不能有非法字符串'
                                }
                            ]
                        })(<Input
                            placeholder="请输入实体的值"
                            type="text"
                        />)}
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