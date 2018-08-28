import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form, Row, Col} from 'antd'
import {isArrayDomain} from 'utils/util'
import {
    fetchIntend,
    fetchEntity,
    postPattern,
    postCorpus,
    predict,
    getPhrase,
    putPhrase,
    deletePhrase,
    postPhrase,
    getPattern
} from 'actions/intend'

import {PatternList, PhraseList, EntityParameters, IntentList, IntentDesc} from "components/index";

let agent = '';

@connect((state, dispatch) => ({
    config: state.config,
    intendResult: state.intendResult,
    entityResult: state.entityResult,
}))

@Form.create({
    onFieldsChange(props, items) {
    },
})
export default class unknownSays extends Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    componentWillMount() {
        agent = this.props.location.query.agent;
        this.initData(agent)
    }

    componentDidMount() {
    }

    initData (agent) {
        this.props.dispatch(fetchIntend('?agent=' + agent, data => {
            console.log(data)
        }, error => {
            console.log(error)
        }))
    }

    render() {
        const style = {
        };
        return <span>unknown says</span>
    }
}
