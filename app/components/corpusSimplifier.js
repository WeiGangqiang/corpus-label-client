import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Input, Button} from 'antd'
import {
    fetchIntend,
    fetchEntity,
    fetchCorpus,
    postCorpus,
    simplifier,
    predict,
    getPhrase,
    putPhrase,
    deletePhrase,
    postPhrase
} from 'actions/intend'

const FormItem = Form.Item

@Form.create({
    onFieldsChange(props, items) {
    },
})
@connect((state, dispatch) => ({}))
export class CorpusSimplifier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newCorpus: '',
            simCorpus: ''
        }
    }

    simplifier = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(simplifier({x: values.newCorpus}, data => {
                    this.setState({
                        simCorpus: data.y
                    })
                }, err => {
                    console.log(err)
                }))
            }
        })
    }

    corpusInput = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    newCorpus: values.newCorpus
                })
            }
        })
    }
    corpusBlur = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    newCorpus: values.newCorpus
                })
            }
        })
    }

    useSimCorpus = () => {
        console.log('use sim corpus ......')
        this.props.addPattern(this.state.simCorpus)
        this.setState({
            simCorpus: '',
            newCorpus: ''
        })
        this.props.form.setFieldsValue({
            newCorpus: ''
        })
    }

    noUseSimCorpus = () => {
        console.log('no use sim corpus ......')
        this.props.addPattern(this.state.newCorpus)
        this.setState({
            newCorpus: '',
            simCorpus: ''
        })
        this.props.form.setFieldsValue({
            newCorpus: ''
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form
        const style = {
            simContainer:{
                marginTop: '15px'
            },
            newCorpusBox: {
                width: '300px',
                lineHeight: '32px',
                display: 'inline-block',
                border: '1px solid #dadada',
                borderRadius: '4px',
                paddingLeft: '15px',
                fontSize: '14px'
            },
        }
        return (
            <div style={style.simContainer}>
                <Form layout="inline">
                    <FormItem>
                        {getFieldDecorator('newCorpus', {})(
                            <Input style={{width: '300px'}} placeholder="请输入新的语料" onPressEnter={this.simplifier}
                                   onChange={this.corpusInput} onBlur={this.corpusBlur}/>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" disabled={!this.state.newCorpus} onClick={this.simplifier}>
                            简化
                        </Button>
                    </FormItem>
                </Form>
                <div style={{display: 'flex', marginTop: '20px'}}>
                    <div style={style.newCorpusBox}>{this.state.simCorpus}</div>
                    <Button onClick={this.useSimCorpus} type="primary" disabled={!this.state.simCorpus}
                            style={{marginLeft: '16px'}}>
                        使用简化模型
                    </Button>
                    <Button style={{marginLeft: '16px'}} disabled={!this.state.simCorpus} onClick={this.noUseSimCorpus}>不使用简化模型</Button>
                </div>
            </div>
        )
    }
}