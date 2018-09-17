import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PatternLine} from 'components/pattern'
import {getPattern, deletePattern, putPattern, predict, postPattern, fetchEntity, getPhrase} from 'actions/intent'
import {Simplifier} from 'components/Simplifer'
import { Tabs, Button } from 'antd';

@connect((state, dispatch) => ({}))

export class PatternList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posSimpliferKey: 0,
            negSimpliferKey: 0,
            slotLabel: ''
        }
    }

    removePatternBy = (patternId, corpusType) => {
        // console.log('patternId', patternId, 'removed')
        let that = this
        this.props.dispatch(deletePattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName,
            slotLabel: this.props.labelValue
        }, data => {
            this.props.initPattern(this.props.intentId, this.props.labelValue)
        }))
    };

    updateSelectLabel = (patternId, selectLoc, corpusType) => {
        this.props.updatePhrase()
        this.updatePatternLabels(patternId, selectLoc, corpusType)
    };

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
    }

    updatePatternLabels = (patternId, newLabel, corpusType) => {
        let patternList = this.getPatternListBy(corpusType)
        let pattern = patternList[patternId]
        pattern.labels = this.updateNewLabels(pattern.labels, newLabel)
        this.props.dispatch(putPattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName,
            "pattern": pattern,
            slotLabel: this.props.labelValue
        }, data => {
            this.props.initPattern(this.props.intentId, this.props.labelValue)

        }))

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
        this.props.dispatch(postPattern({
            pattern: {
                sentence: newCorpus,
                labels: labels
            },
            type: corpusType,
            intentId: this.props.intentId,
            agent: this.props.agentName,
            slotLabel: this.props.labelValue
        }, data => {
            this.props.initPattern(this.props.intentId, this.props.labelValue)
        }))
    }

    addPatternWithPredict = (sentence, corpusType) => {
        let that = this
        this.props.dispatch(predict({
            "sentence": sentence,
            "intentId": this.props.intentId,
            "agent": this.props.agentName
        }, data => {
            // console.log('predict labels is', data)
            that.addPattern(sentence, data, corpusType)
        }, error => {
            console.log(error)
        }))
    }

    removeLabel = (patternId, labelIndex, corpusType) => {
        let patternList = this.getPatternListBy(corpusType)
        let pattern = patternList[patternId]
        let newLabels =  pattern.labels.filter((value, index)=>{
            return index != labelIndex
        })
        pattern.labels = newLabels
        this.props.dispatch(putPattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName,
            "pattern": pattern,
            slotLabel: this.props.labelValue
        }, data => {
            this.props.initPattern(this.props.intentId, this.props.labelValue)
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
        return <p style={subtitleCss}> 用户语料 </p>
    }

    getPatternListBy = (corpusType) => {
       return  (corpusType == 'positive') ? this.props.positivePatterns : this.props.negativePatterns
    }


    getPatternViews = (corpusType) => {
        const that = this
        if(this.refs.div){
            setTimeout(function(){
                that.refs.div.scrollTop = that.refs.div.scrollHeight
            })
        }
        let patternList = this.getPatternListBy(corpusType)
        if (patternList === "") {
            return ""
        }
        return patternList.map((pattern, patternId) => {
            return (<PatternLine key={patternId} patternId={patternId} pattern={pattern}
                                 removePatternBy={this.removePatternBy} updateSelectLabel={this.updateSelectLabel}
                                 agent={this.props.agentName} intent={this.props.intent}
                                 entityParam={this.props.entityParam} phraseArray={this.props.phraseArray}
                                 intentId={this.props.intentId} corpusType={corpusType} removeLabel={this.removeLabel}/>)
        })
    }

    updateTabPane = (key)=> {
        // console.log('change key', key)
    }

    setTypeNum = (label) => {
        this.props.initPattern(this.props.intentId, label)
    };

    getTabs = () => {
        let entityParam = [
            {
                name: '主意图',
                slotLabel: '',
                require: true,
                label: ''
            }
        ];
        if(this.props.entityParam.length){
            entityParam = [...entityParam, ...this.props.entityParam].filter(item => item.require == true);
            return entityParam.map((item,index) => {
                return <Button className='patternBtn' onClick={this.setTypeNum.bind(this,item.label)} type={this.props.labelValue == item.label ? 'primary' : 'default'} key={index}>槽位{item.name}</Button>
            })
        }
    };

    render() {
        const style = {
            pBox: {
                height: '350px',
                border: '1px solid #dadada',
                overflow: 'auto'
            },
            corpusTab: {
                height: '500px',
            },
            corpusTabPane: {
                // paddingTop: '20px'
                // border: '1px solid #dadada',
            }
        }
        const TabPane = Tabs.TabPane;

        return (<div className='table-container'>
            <p className='table-container-title' style={{display: 'inline-block'}}> 用户语料 </p>

            {
                this.getTabs()
            }
            <Tabs type="card" style={style.corpusTab} defaultActiveKey="1" onChange={this.updateTabPane}>
                <TabPane style={style.corpusTabPane} tab="正样本" key="positive">
                    <div ref="div" style={style.pBox}> {this.getPatternViews("positive")}</div>
                    <Simplifier key={this.state.posSimpliferKey} corpusType="positive" addPattern={this.addPatternWithPredict}></Simplifier>
                </TabPane>
                <TabPane style={style.corpusTabPane} tab="负样本" key="negative">
                    <div  ref="div" style={style.pBox}> {this.getPatternViews("negative")}</div>
                    <Simplifier key={this.state.posSimpliferKey} corpusType="negative" addPattern={this.addPatternWithPredict}></Simplifier>
                </TabPane>
            </Tabs>
        </div>)
    }
}

PatternList.propTypes = {
    agentName: React.PropTypes.string,
    intentId: React.PropTypes.string,
    corpusType: React.PropTypes.string
};
