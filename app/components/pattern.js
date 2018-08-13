import React, {Component} from 'react'
import {Button, Row, Col} from 'antd'
import {ColorDownList} from "./colorDownList";

export class PatternLine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDownlist: false,
            top: 0,
            left: 0
        }
    }

    getSpanStyleBy = (type) => {
        const style = {
            entity: {
                background: 'blue',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '3px'
            },
            similar: {
                background: 'green',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '3px'
            }
        }
        return (type == 'entity') ? style.entity : style.similar
    }

    getSpans = () => {
        let sentence = this.props.pattern.sentence
        let labels = this.props.pattern.labels
        let startPos = 0
        let spans = []
        labels.forEach(label => {
            if (startPos < label.startPos) {
                spans.push(<span className='corpusBlock' key={spans.length} id={spans.length}>{sentence.slice(startPos, label.startPos)}</span>)
            }
            spans.push(<span className='corpusBlock' key={spans.length} id={spans.length}
                             style={this.getSpanStyleBy(label.type)}>{sentence.slice(label.startPos, label.startPos + label.length)}</span>)
            startPos = label.startPos + label.length
        })
        if (startPos < sentence.length) {
            spans.push(<span className='corpusBlock' key={spans.length} id={spans.length}>{sentence.slice(startPos)}</span>)
        }
        return spans
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

        console.log('select word is called........')
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
                sentence: selection.toString()
            })
        }
    }

    removePattern = () => {
        this.props.removePatternBy(this.props.patternId)
    }

    hideDownlist = () => {
        this.setState({
            showDownlist: false
        })
    }

    entityOrPhrase = (obj) => {

        this.props.updateSelectLabel(this.props.patternId, {
            ...this.calcLabelPos(this.state.selectStartPos, this.state.selectEndPos),
            id: obj.id,
            type: obj.type
        })
    }

    render() {
        const style={
            corpusBox:{
                borderBottom: '1px solid #dadada',
                paddingLeft: '15px'
            },
            corpusP:{
                lineHeight: '32px'
            }
        }
        return (<Row style={style.corpusBox}>
            <Col span={20}>
                <p style={style.corpusP} onMouseUp={this.selectWord}>{this.getSpans()}</p>
            </Col>
            <Col span={4}>
                <Button onClick={this.removePattern} icon="close"></Button>
            </Col>
            {
                this.state.showDownlist ?
                    <ColorDownList top={this.state.top} sentence={this.state.sentence} left={this.state.left}
                                   intent={this.props.intent} agent={this.props.agent} intentId={this.props.intentId}
                                   hideDownlist={this.hideDownlist} entityOrPhrase={this.entityOrPhrase}/> : ''
            }
        </Row>)
    }
}

PatternLine.propTypes = {
    patternId: React.PropTypes.number,
    removePatternBy: React.PropTypes.func,
    pattern: React.PropTypes.object,
    updateSelectLabel: React.PropTypes.func
};