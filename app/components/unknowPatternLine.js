import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button, Row, Col, Icon, Modal} from 'antd'
import {UnknownColorDownList} from "./unknownColorDownList";
import {generate} from 'actions/intent'

@connect((state, dispatch) => ({}))
export class UnknownPatternLine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDownlist: false,
            top: 0,
            left: 0,
            detailVisible:false,
            sentenceArray: []
        }
    }
    getlabelColor = (label) => {
        // console.log('phrase list', this.props.phraseArray, 'label is', label)
        if (label.type == 'entity') {
            let entity = this.props.entityParam.find((value)=> {
                return value.name == label.id
            });
            return !entity ? 'blue': entity.color
        }
    };

    getSpanStyleBy = (label) => {
        return {
            background: this.getlabelColor(label),
            color: '#fff',
            padding: '2px',
            borderRadius:'5px'
        }
    }

    labelSpanSelected = (e) => {
        // console.log('span is clicked', e)
        let selection = (window.getSelection) ? window.getSelection() : document.getSelection()
        // console.log('selection is ',selection)
        let labelIndex = this.getLabelIndexBy(selection.anchorNode.parentNode.id)
        let label = this.props.pattern.labels[labelIndex]
        if(labelIndex != -1){
            this.setState({
                showDownlist: true,
                top: e.pageY,
                left: e.pageX,
                selectStartPos: label.startPos,
                selectEndPos: label.startPos + label.length,
                length: label.length,
                sentence: this.props.pattern.sentence.slice(label.startPos, label.startPos + label.length),
                hasLabel: true,
                labelIndex: labelIndex,
                label: label
            })
        }
    }

    getSpans = () => {
        let sentence = this.props.pattern.sentence
        let labels = this.props.pattern.labels
        let startPos = 0
        let spans = []
        labels.forEach(label => {
            if (startPos < label.startPos) {
                spans.push(<span  key={spans.length} id={spans.length}>{sentence.slice(startPos, label.startPos)}</span>)
            }
            spans.push(<span key={spans.length} id={spans.length}
                             style={this.getSpanStyleBy(label)} onClick={this.labelSpanSelected} >{sentence.slice(label.startPos, label.startPos + label.length)}</span>)
            startPos = label.startPos + label.length
        })
        if (startPos < sentence.length) {
            spans.push(<span key={spans.length} id={spans.length}>{sentence.slice(startPos)}</span>)
        }
        return spans
    }

    getLabelIndexBy = (id) => {
        let labels = this.props.pattern.labels
        let startPos = 0
        let index = 0
        for (let i in labels){
            let label = labels[i]
            if (startPos < label.startPos) {
                if(index == id) return -1
                index = index + 1
            }
            if( index == id){
                return i
            }
            index = index + 1
            startPos = label.startPos + label.length
        }
        return -1
    }

    getSpanStartPos = () => {
        let sentence = this.props.pattern.sentence
        let labels = this.props.pattern.labels
        let startPos = 0
        let spanStarts = []
        labels.forEach(label => {
            if (startPos < label.startPos) {
                spanStarts.push(startPos)
            }
            spanStarts.push(label.startPos)
            startPos = label.startPos + label.length
        })
        if (startPos < sentence.length) {
            spanStarts.push(startPos)
        }
        return spanStarts
    }

    calcShiftPos = (spanId, offset) => {
        let spanStartPos = this.getSpanStartPos()
        return spanStartPos[parseInt(spanId)] + offset
    }

    calcLabelPos = (startPos, endPos) => {
        if (startPos > endPos) {
            return {startPos: endPos, length: (startPos - endPos)}
        } else {
            return {startPos: startPos, length: (endPos - startPos)}
        }
    }

    selectWord = (e) => {
        let selection = (window.getSelection) ? window.getSelection() : document.getSelection()
        // console.log('select word is called........')
        if (selection.toString().length > 0) {
            let selectStartPos = this.calcShiftPos(selection.anchorNode.parentNode.id, selection.anchorOffset)
            let selectEndPos = this.calcShiftPos(selection.focusNode.parentNode.id, selection.focusOffset)
            this.setState({
                showDownlist: true,
                top: e.pageY,
                left: e.pageX,
                selectStartPos: selectStartPos,
                selectEndPos: selectEndPos,
                length: selection.toString().length,
                sentence: selection.toString(),
                hasLabel: false
            })
        }
    }

    removePattern = () => {
        this.props.removePatternBy(this.props.patternId, this.props.corpusType)
    }

    hideDownlist = () => {
        this.setState({
            showDownlist: false
        })
    }

    entityOrPhrase = (obj) => {

        const objj = {
            sentence: "帮我查查[礼拜日]/L0 的课表",
            accept: true,
            intentId: this.props.intentId,
            intent:  this.props.intent
        }

        const {startPos,length} = this.calcLabelPos(this.state.selectStartPos, this.state.selectEndPos)

        // console.log(obj.label,this.props.pattern.sentence,startPos,length)
        this.props.updateSelectLabel(this.props.patternId, {
            ...this.calcLabelPos(this.state.selectStartPos, this.state.selectEndPos),
            id: obj.id,
            type: obj.type
        }, obj.label)

    }

    removeLabel = (labelIndex)=> {
        // console.log('remove label for', labelIndex)
        this.props.removeLabel(this.props.patternId, labelIndex, this.props.corpusType)
    };

    getlabel = (label) => {
        let entity = this.props.entityParam.find((value)=> {
            return value.name == label.id
        })
        return !entity ? 'L0': entity.label
    };

    getRightSentence = (obj) => {
        let sentence = obj.sentence;
        let rightSentence = '';
        let start = 0;
        for (let i = 0; i<obj.labels.length; i++) {
            rightSentence = rightSentence + sentence.substr(start,obj.labels[i].startPos-start) + '[' + sentence.substr(obj.labels[i].startPos,obj.labels[i].length) + ']/' + this.getlabel(obj.labels[i]) + ' '
            start = obj.labels[i].startPos + obj.labels[i].length
        }
        rightSentence += sentence.substr(start)
        return rightSentence
    }

    saveCorpus = () => {
        this.getRightSentence(this.props.pattern)
        let obj = {
            "sentence": this.getRightSentence(this.props.pattern),
            "accept"  : true,
            "intentId": this.props.intentId,
            "intent"  :  this.props.intent
        };
        this.props.saveCorpus(obj)
    };

    showPattern = () => {
        // console.log(this.props.pattern)
        this.setState({
            detailVisible: true
        })
        this.props.dispatch(generate({
            "pattern"  : this.props.pattern,
            "intentId" : this.props.intentId,
            "agent"    : this.props.agent
        },data => {
            let reg = /[\[\]]/g
            let labelReg = /\/L[0-9]/g
            for(let i = 0; i < data.length; i++){
                data[i] = data[i].replace(reg,'').replace(labelReg,'')
            }
            this.setState({
                sentenceArray: [...data]
            })
        }, error => {
            console.log(error)
        }))
    }

    turnOff = () => {
        this.setState({
            detailVisible: false
        })
    }

    render() {
        const style={
            corpusBox:{
                borderBottom: '1px solid #dadada',
                paddingLeft: '15px',
                paddingRight: '10px',
            },
            colRight:{
                float: 'right',
                marginTop: '4px',
                marginLeft: '10px',
                cursor:'pointer'
            },
            corpusP:{
                marginBottom: 0,
                lineHeight: '45px',
                fontSize: '16px'
            },
            delete:{
                marginTop: '5px',
                fontSize :'20px',
            },
            sentenceDiv:{
                lineHeight: '32px',
                borderBottom: '1px solid #dadada'
            }
        }
        return (<Row className="corpusItem" style={style.corpusBox}>
            <Col style={style.colRight}>
                <span onClick={this.removePattern}> <Icon type="delete" style={style.delete} /></span>
            </Col>
            <Col style={style.colRight}>
                <span onClick={this.saveCorpus}> <Icon type="save" style={style.delete}/></span>
            </Col>
            <Col >
                <p style={style.corpusP} onMouseUp={this.selectWord}>{this.getSpans()}</p>
            </Col>
            {
                this.state.showDownlist ?
                    <UnknownColorDownList top={this.state.top} sentence={this.state.sentence} left={this.state.left}
                                   hasLabel={this.state.hasLabel} labelIndex={this.state.labelIndex} label={this.state.label} removeLabel={this.removeLabel}
                                   intent={this.props.intent} agent={this.props.agent} intentId={this.props.intentId}
                                   entityParam={this.props.entityParam} phraseArray={this.props.phraseArray}
                                   hideDownlist={this.hideDownlist} entityOrPhrase={this.entityOrPhrase}/> : ''
            }
            <Modal
                title="详情"
                visible={this.state.detailVisible}
                onCancel={this.turnOff}
                destroyOnClose={true}
                footer={null}
            >
                {
                    this.state.sentenceArray.map((item, index) => {
                        return <div style={style.sentenceDiv} key={index}>{item}</div>
                    })
                }
            </Modal>
        </Row>)
    }
}

UnknownPatternLine.propTypes = {
    patternId: React.PropTypes.number,
    removePatternBy: React.PropTypes.func,
    pattern: React.PropTypes.object,
    updateSelectLabel: React.PropTypes.func
};
