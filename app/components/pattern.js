import React, { Component } from 'react'
import {Button} from 'antd'

export class PatternLine extends Component {
    constructor(props) {
        super(props)
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
            }
        }
        return  (type == 'entity') ? style.entity : style.similar
    }

    getSpans = () => {
        let sentence = this.props.pattern.sentence
        let labels = this.props.pattern.labels
        let startPos = 0
        let spans = []
        labels.forEach(label => {
            if(startPos < label.startPos){
                spans.push(<span key={spans.length} id={spans.length}>{sentence.slice(startPos, label.startPos)}</span>) 
            }
            spans.push(<span key={spans.length} id={spans.length} style ={this.getSpanStyleBy(label.type)}>{sentence.slice(label.startPos, label.startPos + label.length)}</span>)
            startPos = label.startPos + label.length
        })
        if (startPos < sentence.length){
            spans.push(<span key={spans.length} id={spans.length}>{sentence.slice(startPos)}</span>)
        }
        return spans
    }

    getSpanStartPos = () => {
        let sentence = this.props.pattern.sentence
        let labels = this.props.pattern.labels
        let startPos = 0
        let spanStarts = []
        labels.forEach(label => {
            if(startPos < label.startPos){
                spanStarts.push(startPos) 
            }
            spanStarts.push(label.startPos)
            startPos = label.startPos + label.length
        })
        if (startPos < sentence.length){
            spanStarts.push(startPos)
        }
        return spanStarts
    }

    calcStartPos = (spanId, offset) => {
        let spanStartPos = this.getSpanStartPos()
        return spanStartPos[parseInt(spanId)] + offset
    }

    selectWord = (e) => {
        // console.log(e)
        // console.log('pageX:' + e.pageX, 'pageY:' + e.pageY)
      // console.log('screenX:' + e.screenX, 'screenY:' + e.screenY)
        let selection = (window.getSelection) ? window.getSelection(): document.getSelection()
        // console.log(selection.isCollapsed)
      if (!selection.isCollapsed) {
        let selectStartPos = this.calcStartPos(selection.anchorNode.parentNode.id, selection.anchorOffset)
        this.props.updateSelectLabel(this.props.patternId, {startPos: selectStartPos, length: selection.toString().length})
      }
    }

    removePattern = () => {
        console.log('pattern id is called')
        this.props.removePatternBy(this.props.patternId)
    }
    
    render() {
        return (<div><p onMouseUp={this.selectWord}>{this.getSpans()}</p> 
                    <Button onClick={this.removePattern}> 删除</Button>
                 </div>)
    }
}

PatternLine.propTypes = { 
    patternId: React.PropTypes.number,
    removePatternBy: React.PropTypes.func,
    pattern :React.PropTypes.object,
    updateSelectLabel: React.PropTypes.func};