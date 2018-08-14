import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Form, AutoComplete, Button} from 'antd'
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
            dataSource: [],
            orginal:'',
            simplify:''
        }
    }

    onSelect = (value) => {
        console.log('selected value', value)
        this.setState({
            simplify: value
        })
    }

    handleSearch = (value) => { 
        console.log('update input value', value)
        this.props.dispatch(simplifier({x: value}, data => {
            this.setState({
                dataSource: !value && data.y!=value ? [] : [
                    data.y
                ],
                orginal: value,
                simplify: value
            })
        }))
    }

    isSimplified = () => {
        return this.state.simplify != ''
    }

    addCorpusToIntent = ()=> {   
        this.props.addPattern(this.state.simplify, this.props.corpusType)
        this.setState({
            dataSource: [],
            orginal: '',
            simplify: ''
        })
    }

    render(){
        return (
            <Form style={{marginTop: '15px'}} layout="inline">
                <FormItem>
                    <AutoComplete
                        dataSource={this.state.dataSource}
                        style={{ width: 500 }}
                        onSelect={this.onSelect}
                        onSearch={this.handleSearch}
                        placeholder="请输入语料"
                    />
                </FormItem>
                <FormItem>
                    <Button type="primary"  onClick={this.addCorpusToIntent}>
                        添加
                    </Button>
                </FormItem>
            </Form>
        )
    }
}