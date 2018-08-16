import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PatternLine} from 'components/pattern'
import {getPattern, deletePattern, putPattern, predict, postPattern, fetchEntity, getPhrase} from 'actions/intend'
import {Simplifier} from 'components/Simplifer'
import { Tabs } from 'antd';

@connect((state, dispatch) => ({}))

export class PatternList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            positivePatterns: [],
            negativePatterns: [],
            posSimpliferKey: 0,
            negSimpliferKey: 0,
            entityParam: [],
            phraseArray:[]
        }
    }

    getEntityForIntent = (props) =>{
        let entityUrl = '?agent=' + props.agentName + '&intentId=' + props.intentId
        console.log('get entity for intent url', entityUrl, )
        this.props.dispatch(fetchEntity(entityUrl, data => {
            for (let i = 0; i < data.length; i++) {
                data[i].valuesF = [...data[i].values]
                for (let j = 0; j < data[i].valuesF.length; j++) {
                    let reg = /[\[\]]/g
                    let labelReg = /\/L[0-9]/g
                    data[i].valuesF[j] = data[i].valuesF[j].replace(reg, '').replace(labelReg, '')
                }
                data[i].valuesShow = [...data[i].valuesF.slice(0, 10)]
            }
            console.log('get  entity data', data)
            this.setState({
                entityParam: [...data]
            })
        }, error => {
        }))
    }

    getPhraseForIntent = (props) =>{
        let getUrl = '?agent=' + props.agentName + '&intentId=' + props.intentId
        console.log('get phrase url is ', getUrl, props)
        this.props.dispatch(getPhrase(getUrl
            , data => {
                console.log('get phrase data', data)
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    }

    componentWillReceiveProps(props) {
        this.getPatternList(props, "positive")
        this.getPatternList(props, "negative")
        this.getEntityForIntent(props)
        this.getPhraseForIntent(props)
    }

    getPatternList = (props, corpusType) => {
        let url = '?agent=' + props.agentName + '&intentId=' + props.intentId + '&type=' + corpusType
        if (this.props.intentId === '1') {
            console.log('intent id is invalid')
            return
        }
        this.props.dispatch(getPattern(url,
            (data) => {
                console.log('reading pattern data is', data)
                if(corpusType == "positive"){
                    this.setState({positivePatterns: data})
                }
                else{
                    this.setState({negativePatterns: data})
                }
            },
            (err) => {
                console.log(err)
            }))
    }

    removePatternBy = (patternId, corpusType) => {
        console.log('patternId', patternId, 'removed')
        let that = this
        this.props.dispatch(deletePattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName
        }, data => {
            that.getPatternList(that.props, corpusType)
        }))
    }

    updateSelectLabel = (patternId, selectLoc, corpusType) => {
        this.props.updatePhrase()
        console.log('patternId', patternId, selectLoc)
        this.updatePatternLabels(patternId, selectLoc, corpusType)
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
    }

    updatePatternLabels = (patternId, newLabel, corpusType) => {
        let patternList = this.getPatternListBy(corpusType)
        let pattern = patternList[patternId]
        pattern.labels = this.updateNewLabels(pattern.labels, newLabel)
        let that = this
        this.props.dispatch(putPattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName,
            "pattern": pattern
        }, data => {
            that.getPatternList(that.props, corpusType)
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
        console.log('add pattern for', newCorpus, labels, corpusType)
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
            console.log('add pattern result', data)
            that.getPatternList(that.props, corpusType)
        }))
    }

    addPatternWithPredict = (sentence, corpusType) => {
        let that = this
        this.props.dispatch(predict({
            "sentence": sentence,
            "intentId": this.props.intentId,
            "agent": this.props.agentName
        }, data => {
            console.log('predict labels is', data)
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
        let that = this
        this.props.dispatch(putPattern({
            "patternId": patternId,
            "type": corpusType,
            "intentId": this.props.intentId,
            "agent": this.props.agentName,
            "pattern": pattern
        }, data => {
            that.getPatternList(that.props, corpusType)
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
       return  (corpusType == 'positive') ? this.state.positivePatterns : this.state.negativePatterns 
    }


    getPatternViews = (corpusType) => {
        let patternList = this.getPatternListBy(corpusType)
        return patternList.map((pattern, patternId) => {
            return (<PatternLine key={patternId} patternId={patternId} pattern={pattern}
                                 removePatternBy={this.removePatternBy} updateSelectLabel={this.updateSelectLabel}
                                 agent={this.props.agentName} intent={this.props.intent}
                                 entityParam={this.state.entityParam} phraseArray={this.state.phraseArray}
                                 intentId={this.props.intentId} corpusType={corpusType} removeLabel={this.removeLabel}/>)
        })
    }

    updateTabPane = (key)=> {
        console.log('change key', key)
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
            },
            corpusTab: {
                padding: '10px 15px',
                height: '500px',
            },
            corpusTabPane: {
                // paddingTop: '20px'
                // border: '1px solid #dadada',
            }
        }
        const TabPane = Tabs.TabPane;

        return (<div style={style.corpusBox}>
               {this.getTitle()}
            <Tabs type="card" style={style.corpusTab} defaultActiveKey="1" onChange={this.updateTabPane}>
                <TabPane style={style.corpusTabPane} tab="正样本" key="positive">
                    <div style={style.pBox}> {this.getPatternViews("positive")}</div>
                    <Simplifier key={this.state.posSimpliferKey} corpusType="positive" addPattern={this.addPatternWithPredict}></Simplifier>
                </TabPane>
                <TabPane style={style.corpusTabPane} tab="负样本" key="negative">
                    <div style={style.pBox}> {this.getPatternViews("negative")}</div>
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