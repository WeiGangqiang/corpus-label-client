import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PatternLine} from 'components/pattern'
import { getPattern, deletePattern, putPattern, predict, postPattern } from 'actions/intend'
import { CorpusSimplifier } from "./corpusSimplifier";

@connect((state, dispatch) => ({
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
        this.getPatternList(props)
    }
    
    getPatternList = (props) =>{
        let url = '?agent=' + props.agentName + '&intentId=' + props.intentId + '&type=' + props.corpusType
        if(this.props.intentId ==='1'){
            console.log('intent id is invalid')
            return
        }
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
        let that = this
        this.props.dispatch(deletePattern({
            "patternId": patternId,
            "type"     : this.props.corpusType,
            "intentId" : this.props.intentId,
            "agent"    : this.props.agentName
        }, data=> {
            that.getPatternList(that.props)
        }))
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
        newLabels.sort( (left, right) => {
            return left.startPos > right.startPos
        })
        pattern.labels = newLabels
        let that = this
        this.props.dispatch(putPattern({
            "patternId": patternId,
            "type"     : this.props.corpusType,
            "intentId" : this.props.intentId,
            "agent"    : this.props.agentName,
            "pattern"  : pattern
        }, data=>{
            that.getPatternList(that.props)
        }))

    }

    addPattern = (newCorpus, labels) => {
        console.log('add pattern for', newCorpus, labels)
        let that  = this
        this.props.dispatch(postPattern({
            pattern: {
                sentence: newCorpus,
                labels: labels
            },
            type: this.props.corpusType,
            intentId: this.props.intentId,
            agent: this.props.agentName
        }, data => {
            console.log('add pattern result', data)
            that.getPatternList(that.props)
        }))
    }
    
    addPatternWithPredict = (sentence) => {
        let that  = this
        this.props.dispatch(predict({
            "sentence": sentence,
            "intentId": this.props.intentId,
            "agent": this.props.agentName
        }, data => {
            console.log('predict labels is', data)
            that.addPattern(sentence, data)
            console.log('add pattern finish')
        }, error => {
            console.log(error)
        }))
    }

    getTitle = () => {
        const subtitleCss = {
          fontSize: '20px',
          fontWeight: 'bold'
        }
        return <p style={subtitleCss}> 用户语料 </p>
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
            corpusBox:{
                background: '#fbfbfb',
                padding: '15px',
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                marginBottom: '15px' 
            },
        }

        return (<div style={style.corpusBox}> 
                {this.getTitle()}
                <div style={style.pBox}> {this.getPatternViews()}</div>
                <CorpusSimplifier addPattern={this.addPatternWithPredict}></CorpusSimplifier>
                </div>)
    }
}

PatternList.propTypes = { 
    agentName: React.PropTypes.string,
    intentId: React.PropTypes.string,
    corpusType: React.PropTypes.string};