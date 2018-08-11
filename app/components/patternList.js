import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PatternLine} from 'components/pattern'
import { getPattern, deletePattern, putPattern } from 'actions/intend'

@connect((state, dispatch) => ({
    config: state.config,
    intendResult: state.intendResult,
    entityResult: state.entityResult,
  }))

export class PatternList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patternList: [],
            selectLoc : {},
            selectPatternId: 0
        }
    }

    componentWillReceiveProps(props){
        console.log('get pattern list is called', props)
        this.getPatternList(props)
    }

    getPatternList = (props) =>{
        let url = '?agent=' + props.agentName + '&intentId=' + props.intentId + '&type=' + props.corpusType
        if(this.props.intentId ==='1'){
            console.log('intent id is invalid')
            return
        }
        console.log('get pattern url', url)
        this.props.dispatch(getPattern(url,
            (data) => {
                console.log('reading pattern data is', data)
                this.setState({patternList: data})
            },
            (err) => {
                console.log(err)
            }))
    }

    removePatternBy = (patternId) =>{
        console.log('patternId', patternId, 'removed')
        this.props.dispatch(deletePattern({
            "patternId": patternId,
            "type"     : this.props.corpusType,
            "intentId" : this.props.intentId,
            "agent"    : this.props.agentName
        }))
        this.getPatternList(this.props)
    }

    updateSelectLabel = (patternId, selectLoc) => {
        this.setState({ selectPatternId: patternId, selectLoc: selectLoc })
        let stubLabel = {type:'entity', id:"star", startPos: selectLoc.startPos, length: selectLoc.length}
        this.updatePatternLabels(patternId, stubLabel)
        console.log('patternId', patternId, selectLoc)
    }

    isLocOverLap = (selectLoc, labelLoc) => {
        if(labelLoc.startPos + labelLoc.length <= selectLoc.startPos){
            return false
        }
        if(selectLoc.startPos + selectLoc.length <= labelLoc.startPos){
            return false
        }
        return true
    }

    updatePatternLabels = (patternId, newLabel) => {
        let pattern = this.state.patternList[patternId]
        let labels = pattern.labels
        let newLabels =labels.filter( (label) => {
            return !this.isLocOverLap(newLabel, label)  
        })
        newLabels.push(newLabel)
        pattern.labels = newLabels
        console.log('new Labels is ', newLabels)
        console.log('pattern is', pattern)
        this.props.dispatch(putPattern({
            "patternId": patternId,
            "type"     : this.props.corpusType,
            "intentId" : this.props.intentId,
            "agent"    : this.props.agentName,
            "pattern"  : pattern
        }))

        this.getPatternList(this.props)
    }

    getPatternViews = () => {
        return this.state.patternList.map((pattern, patternId) => {
            return (<PatternLine key={patternId} patternId={patternId} pattern={pattern} removePatternBy={this.removePatternBy} updateSelectLabel={this.updateSelectLabel}/>)
        })
    }

    render() {
        const style = {
            pBox:{
                position: 'relative',
                border: '1px solid #dadada',
              },
        }

        return <div style={style.pBox}> {this.getPatternViews()}</div>
    }
}

PatternList.propTypes = { 
    agentName: React.PropTypes.string,
    intentId: React.PropTypes.string,
    corpusType: React.PropTypes.string};