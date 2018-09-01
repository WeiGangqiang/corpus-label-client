import React, {Component} from 'react'
import {connect} from 'react-redux'
import {UnknownPatternLine} from "./unknowPatternLine";
import {getPattern, deletePattern, putPattern, predict, postPattern, fetchEntity, getPhrase} from 'actions/intent'
import {Simplifier} from 'components/Simplifer'

@connect((state, dispatch) => ({}))

export class UnknownPatternList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posSimpliferKey: 0,
            negSimpliferKey: 0
        }
    }

    removePatternBy = (patternId, corpusType) => {
        let that = this
        this.props.dispatch(deletePattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName
        }, data => {
            that.props.getPatternList(that.props, corpusType)
        }))
    }

    updateSelectLabel = (patternId, selectLoc, label) => {
        this.updatePatternLabels(patternId, selectLoc, label)
    }

    isLocOverLap = (selectLoc, labelLoc) => {
        if (labelLoc.startPos + labelLoc.length <= selectLoc.startPos) {
            return false
        }
        if (selectLoc.startPos + selectLoc.length <= labelLoc.startPos) {
            return false
        }
        return true
    }

    updateNewLabels = (labels, newLabel)=> {
        let newLabels = labels.filter((label) => {
            return !this.isLocOverLap(newLabel, label)
        })
        newLabels.push(newLabel)
        newLabels.sort((left, right) => {
            return left.startPos > right.startPos
        })
        return  newLabels
    };

    getRightLabels = () => {

    };

    updatePatternLabels = (patternId, newLabel, label) => {
        let pattern = this.props.patterns[patternId]
        pattern.labels = this.updateNewLabels(pattern.labels, newLabel)
    }

    updateSimpliferKey = (corpusType) => {
        if(corpusType == 'positive'){
            this.setState({
                posSimpliferKey: this.state.posSimpliferKey + 1
            })
        }else{
            this.setState({
                posSimpliferKey: this.state.negSimpliferKey + 1
            })
        }
    }

    addPattern = (newCorpus, labels, corpusType) => {
        // console.log('add pattern for', newCorpus, labels, corpusType)
        this.updateSimpliferKey(corpusType)
        let that = this
        this.props.dispatch(postPattern({
            pattern: {
                sentence: newCorpus,
                labels: labels
            },
            type: corpusType,
            intentId: this.props.intentId,
            agent: this.props.agentName
        }, data => {
            // console.log('add pattern result', data)
            that.props.getPatternList(that.props, corpusType)
        }))
    }

    removeLabel = (patternId, labelIndex, corpusType) => {
        let patternList = this.getPatternListBy(corpusType)
        let pattern = patternList[patternId]
        let newLabels =  pattern.labels.filter((value, index)=>{
            return index != labelIndex
        })
        pattern.labels = newLabels
        let that = this
        this.props.dispatch(putPattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName,
            "pattern": pattern
        }, data => {
            that.props.getPatternList(that.props, corpusType)
        }))
    }

    getTitle = () => {
        const subtitleCss = {
            fontSize: '20px',
            fontWeight: 'bold',
            paddingLeft: '15px',
            marginBottom: '0px',
            lineHeight: '40px'
        }
        return <p style={subtitleCss}> 未识别语料 </p>
    }

    getPatternListBy = (corpusType) => {
        return  (corpusType == 'positive') ? this.props.positivePatterns : this.props.negativePatterns
    }


    getPatternViews = () => {
        const that = this
        if(this.refs.div){
            setTimeout(function(){
                that.refs.div.scrollTop = that.refs.div.scrollHeight
            })
        }
        return this.props.patterns.length && this.props.patterns.map((pattern, index) => {
            return (<UnknownPatternLine key={index} patternId={index} pattern={pattern}
                                 removePatternBy={this.removePatternBy} updateSelectLabel={this.updateSelectLabel}
                                 agent={this.props.agentName} intent={this.props.intent}
                                 entityParam={this.props.entityParam} phraseArray={this.props.phraseArray}
                                 intentId={this.props.intentId} removeLabel={this.removeLabel} saveCorpus={this.props.saveCorpus}/>)
        })
    }

    render() {
        const style = {
            pBox: {
                height: '350px',
                border: '1px solid #dadada',
                overflow: 'auto'
            },
            corpusBox: {
                background: '#fbfbfb',
                padding: '10px, 15px',
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                marginBottom: '15px'
            }
        }

        return (<div style={style.corpusBox}>
            {this.getTitle()}
            <div ref="div" style={style.pBox}> {this.getPatternViews()}</div>
        </div>)
    }
}

UnknownPatternList.propTypes = {
    agentName: React.PropTypes.string,
    intentId: React.PropTypes.string,
    corpusType: React.PropTypes.string
};
