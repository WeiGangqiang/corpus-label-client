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

    labelSpanSelected = (e) => {
        console.log('span is clicked', e)
        let selection = (window.getSelection) ? window.getSelection() : document.getSelection()
        console.log('selection is ',selection)
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
        console.log('select label is ', label)
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
                             style={this.getSpanStyleBy(label.type)} onClick={this.labelSpanSelected} >{sentence.slice(label.startPos, label.startPos + label.length)}</span>)
            startPos = label.startPos + label.length
        })
        if (startPos < sentence.length) {
            spans.push(<span className='corpusBlock' key={spans.length} id={spans.length}>{sentence.slice(startPos)}</span>)
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
        console.log('add entity phrase list', obj)
        this.props.updateSelectLabel(this.props.patternId, {
            ...this.calcLabelPos(this.state.selectStartPos, this.state.selectEndPos),
            id: obj.id,
            type: obj.type
        }, this.props.corpusType)
    }

    removeLabel = (labelIndex)=> {
        console.log('remove label for', labelIndex)
        this.props.removeLabel(this.props.patternId, labelIndex, this.props.corpusType)
    }

    render() {
        const style={
            corpusBox:{
                borderBottom: '1px solid #dadada',
                paddingLeft: '15px',
                paddingRight: '40px',
            },
            colRight:{
                float: 'right',
                marginRight: '-40px',
                marginTop: '4px'
            },
            corpusP:{
                marginBottom: 0,
                lineHeight: '40px',
                fontSize: '14px'
            }
        }
        return (<Row style={style.corpusBox}>
            <Col style={style.colRight}>
                <Button onClick={this.removePattern} icon="close"></Button>
            </Col>
            <Col >
                <p style={style.corpusP} onMouseUp={this.selectWord}>{this.getSpans()}</p>
            </Col>
            {
                this.state.showDownlist ?
                    <ColorDownList top={this.state.top} sentence={this.state.sentence} left={this.state.left}
                                   hasLabel={this.state.hasLabel} labelIndex={this.state.labelIndex} label={this.state.label} removeLabel={this.removeLabel}
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