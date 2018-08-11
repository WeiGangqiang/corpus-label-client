import React, { Component } from 'react'
import {Button} from 'antd'

export class PatternLine extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patternId : props.patternId,
            pattern: {
                "sentence": "我刘亦菲你喜欢吗吗",
                "labels":
                [{
                  "type": "entity",
                  "id": "star",
                  "length": 3,
                  "startPos": 1
              },
              {
                  "type": "phrase",
                  "id": "14700686050982298",
                  "length": 2,
                  "startPos": 5
              }]
            }
        }
    }
     
    getSpanStyleBy = (type) => {
        const style = {
            entity: {
                background: 'blue',
            },
            similar: {
                background: 'green',
            }
        }
        return  (type == 'entity') ? style.entity : style.similar
    }

    getSpans = () => {
        let sentence = this.state.pattern.sentence
        let labels = this.state.pattern.labels
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
        let sentence = this.state.pattern.sentence
        let labels = this.state.pattern.labels
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
        let selection = (window.getSelection) ? window.getSelection(): document.getSelection()
        let selectStartPos = this.calcStartPos(selection.anchorNode.parentNode.id, selection.anchorOffset)
        this.props.updateSelectLabel(this.state.patternId, {startPos: selectStartPos, length: selection.toString().length})
    }

    removePattern = () => {
        console.log('pattern id is called')
        this.props.removePatternBy(this.state.patternId)
    }
    
    render() {
        return (<div><p onMouseUp={this.selectWord}>{this.getSpans()}</p> 
                    <Button onClick={this.removePattern}> 删除</Button>
                 </div>)
    }
}

PatternLine.propTypes = { 
    patternId: React.PropTypes.string,
    removePatternBy: React.PropTypes.func,
    updateSelectLabel: React.PropTypes.func};