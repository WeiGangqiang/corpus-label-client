import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, Input, Icon, Row, Col, Button} from 'antd'
import { simplifier } from 'actions/intend'

const FormItem = Form.Item

@Form.create({
    onFieldsChange(props, items) {
    },
})

@connect((state, dispatch) => ({}))
export class Simplifier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            simCorpus:'',
            newCorpus:'',
            isSimplified: false
        }
    }

    onSelect = (value) => {
        console.log('selected value', value)
        this.setState({
            simplify: value
        })
    }

    isSimplified = () => {
        return this.state.simCorpus != ''
    }

    addCorpusToIntent = ()=> {  
        this.doSimplifer(this.state.newCorpus)
    }

    corpusAddEnter = (e) => {
        console.log('corpus input enter : ', e)
    }

    corpusInput = () => {
        let that = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('update', values.newCorpus)
                that.setState({
                    newCorpus: values.newCorpus
                })
            }
        })
    }

    corpusBlur = () => {
        let that = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                that.setState({
                    newCorpus: values.newCorpus
                })
            }
        })
    }

    doSimplifer = (newCorpus) => {
        this.props.dispatch(simplifier({x: newCorpus}, data => {
            let isSimplified = data.y != newCorpus
            if (!isSimplified) {
                this.props.addPattern(newCorpus, this.props.corpusType)
            }
            else{
                this.setState({
                    newCorpus: newCorpus,
                    simCorpus: data.y,
                    isSimplified: isSimplified
                })
            }
        }, err => {
            console.log(err)
        }))
    }

    onInputEnter = () => {
        let that = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('that is', )
                that.doSimplifer(values.newCorpus)
            }
        })
    }

    addOrignalSentence = () =>{
        this.props.addPattern(this.state.newCorpus, this.props.corpusType)
        this.setState({
            simCorpus: ''
        })
    }

    addSimpliferSentence = () => {
        this.props.addPattern(this.state.simCorpus, this.props.corpusType)
        this.setState({
            simCorpus: ''
        })
    }

    getSimpliferCheckButtern = () => {
        return <Row>
                <Col span ={12}>  <Button type="primary" onClick = {this.addSimpliferSentence} icon ="check">正确</Button> </Col>
                <Col span ={12}> <Button type="danger" onClick = {this.addOrignalSentence} icon ="close">错误</Button> </Col>
                </Row>
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const style = {
            simplifyBox: {
                width: '1000px',
            },
            add:{
                marginTop: '5px',
                fontSize :'20px',
                color: 'green',
                paddingLeft: '10px'
            },
            button: {
                border: '1px solid #dadada',
            },
            prompt:{
                border: '1px solid #dadada',
            }
        }
        return (
            <Row style={style.simplifyBox}>
                <Col>
                    <Form layout="inline">
                        <FormItem>
                            {getFieldDecorator('newCorpus', {})(
                                <Input style={{ width: '1000px' }} placeholder="请输入新的语料" onPressEnter={this.onInputEnter}
                                    onChange={this.corpusInput} onBlur={this.corpusBlur} addonAfter={<Icon onClick={this.addCorpusToIntent} type="plus" />} />
                             )}
                        </FormItem>
                    </Form>
                </Col>
                <Col span={20}>
                    {this.state.isSimplified ?
                        <Input style={{ width: '800px' }} addonBefore="简化后：" value={this.state.simCorpus} disabled={true}/> : ''
                    }
                </Col>
                <Col span={4}>
                 {  this.state.isSimplified ?
                    this.getSimpliferCheckButtern() : ''}
                </Col>
            </Row>
        )
    }
}