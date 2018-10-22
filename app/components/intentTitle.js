import React, {Component} from 'react';
import {Button, Modal, Form, Input, message} from 'antd'

const FormItem = Form.Item

@Form.create({
    onFieldsChange(props, items) {
    },
})

export class IntentTitle extends Component{
    constructor(props){
        super()
        this.state = {
            addIntentVisible: false,
            modelPath: '',
            state: ''
        }
    }

    intentInput = (e) => {
        this.setState({
            modelPath:this.state.state == 'son' ? this.props.modelPath ? this.props.modelPath + '/' + e.target.value : 'users/'+ sessionStorage.getItem('user') + '/' + this.props.agent + '/' + e.target.value : 'users/'+ sessionStorage.getItem('user') + '/' + this.props.agent + '/' + e.target.value
        })
    };

    showModal = (role) => {
        if(this.props.mode != 'local'){

            this.setState({
                state: role,
                addIntentVisible: true,
                modelPath: role == 'son' ? this.props.modelPath ? this.props.modelPath + '/' : 'users/'+ sessionStorage.getItem('user') + '/' + this.props.agent + '/': 'users/'+ sessionStorage.getItem('user') + '/' + this.props.agent + '/'
            })
        }else{
            message.info('由于mode值为local，不允许新增')
        }
    };

    hideModal = () => {
        this.setState({
            state: '',
            addIntentVisible: false
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.addintent(
                    {
                        intent:{
                            "name": values.name,
                            "zhName": values.zhName,
                            "modelPath": values.modelPath
                        }
                    });
                this.hideModal()
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return <div>
            <div className='entity-container-head margin-top-0 margin-bottom-20'>
                <span className='header-word'>意图</span>
                <Button className='add-new-button' style={{width:'120px',marginLeft: '15px',visibility: this.props.mode == 'server' ? 'visible' : 'hidden'}} onClick={this.showModal.bind(this,'root')} type='primary'>新增顶层意图</Button>
                <Button className='add-new-button' style={{width:'100px',visibility: this.props.mode == 'server' ? 'visible' : 'hidden'}} onClick={this.showModal.bind(this,'son')} type="primary">新增子意图</Button>
            </div>
            <Modal
                title='新增'
                visible={this.state.addIntentVisible}
                centered
                destroyOnClose="true"
                onCancel={this.hideModal}
                footer={null}
                bodyStyle={{padding:0}}
            >
                <Form onSubmit={this.handleSubmit}>
                    <FormItem className="modalFormItem">
                        {getFieldDecorator('name', {
                            rules: [
                                {required: true, message: '请输入意图名字'},
                                {
                                    pattern: /^[0-9a-zA-Z-\u4E00-\u9FFF]+$/,
                                    message: '不能有非法字符串'
                                }
                            ]
                        })(<Input
                            placeholder="请输入意图名字"
                            type="text"
                            onInput={this.intentInput}
                            autoComplete = 'off'
                        />)}
                    </FormItem>
                    <FormItem className="modalFormItem">
                        {getFieldDecorator('zhName', {
                            rules: [
                                {required: true, message: '请输入意图中文名'}
                            ]
                        })(<Input
                            placeholder="请输入意图中文名"
                            type="text"
                            autoComplete = 'off'
                        />)}
                    </FormItem>
                    <FormItem className="modalFormItem">
                        {getFieldDecorator('modelPath', {
                            rules: [
                                {required: true, message: '请输入modelPath'},
                            ],
                            initialValue: this.state.modelPath
                        })(<Input
                            placeholder="请输入modelPath"
                            type="text"
                            disabled
                        />)}
                    </FormItem>
                    <FormItem>
                        <div className='modalFoot'>
                            <Button onClick={this.hideModal}>Cancel</Button>
                            <Button className='modalFootBtn' type="primary" htmlType="submit">
                                OK
                            </Button>
                        </div>
                    </FormItem>
                </Form>

            </Modal>
        </div>
    }
}