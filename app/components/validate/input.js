import React, {Component} from 'react'
import {Form, Input} from 'antd'

const FormItem = Form.Item

@Form.create({
    onFieldsChange(props, items) {
    },
})

export class InputValidate extends Component{
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setName(values.value)
            }else{
                this.props.setName('')
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return <Form onSubmit={this.handleSubmit}>
            <FormItem style={{marginBottom: '1px'}}>
                {getFieldDecorator('value', {
                    rules: [
                        {required: true, message: '请输入变量名'},
                        {
                            pattern: /^[a-zA-Z][0-9a-zA-Z-]*$/,
                            message: '字母开头，数字字母-'
                        }
                    ]
                })(<Input
                    placeholder="请输入变量名"
                    type="text"
                    onChange={this.handleSubmit}
                    onPressEnter={this.handleSubmit}
                    onBlur={this.handleSubmit}
                />)}
            </FormItem>
        </Form>
    }
}