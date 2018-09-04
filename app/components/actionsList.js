import React, {Component} from 'react'
import {Table, Button} from 'antd'

import {getIntentActions, updateIntentActions} from 'actions/intent'

import {connect} from 'react-redux'

@connect((state, dispatch) => ({
}))

export class ActionsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            actions: [
                {type: "replies", values: ["你好", "不好"]},
                {type: "replies", values: ["天天都喜欢你", "我真的很喜欢你"]}
            ]
        }
    }

    componentWillReceiveProps(props){
        this.retreiveActions(props)
    }
    
    retreiveActions = (props) => {
        let entityUrl = '?agent=' + props.agentName + '&intentId=' + props.intentId
        console.log('get actions for intent url', entityUrl, )
        this.props.dispatch(getIntentActions(entityUrl, rsp => {
            console.log('receive intent actions', rsp.data)
            this.setState({actions: rsp.data})
        }, err=> {

        }))
    }

    getTitle = () => {
        const subtitleCss = {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '0px',
            lineHeight: '40px'
        }
        return <p style={subtitleCss}> 动作 </p>
    }

    getActions = () => {
        return this.state.actions
    }

    deleteActionBy(index) {
        console.log("delete action by index", index)
    }

    getActionsType = (type) => {
        const typeDesc = {
            "replies" : "文本",
            "api": "函数调用"
        }
        let desc = typeDesc[type]
        return <span> {desc} </span>
    }

    getActionsContent = (values) => {
        let content = values.join(",")
        return <span>{content} </span>
    }

    getOperators = (actionIndex) => {
        return <Button onClick={this.deleteActionBy.bind(this, actionIndex)} icon="close">删除</Button>
    }

    columns = () => {
        const that = this
        return [
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: '10%',
                render(text, record, index) {
                    return that.getActionsType(text)
                }
            },
            {
                title: '内容',
                dataIndex: 'values',
                key: 'values',
                render(text, record, index) {
                    return that.getActionsContent(text)
                }
            },
            {
                title: '操作',
                dataIndex: 'delete',
                key: 'delete',
                render(text, record, index) {
                    return that.getOperators(index)
                }
            }
        ]
    }

    render(){
        const style = {
            actionsContainer: {
                marginTop: '15px',
                background: '#fbfbfb',
                borderRadius: '15px',
                padding: '10px 15px',
                marginBottom: '50px',
            }
        }
        if(this.props.intentMode == "local"){
            return (<div/>)
        }

        return (<div style={style.actionsContainer}>
            {this.getTitle()}
            <Table
                dataSource={this.getActions()}
                columns={this.columns()}
                bordered
                pagination={false}
            />
            <div style={{ height: '10px' }}> </div>
        </div>)
    }
}