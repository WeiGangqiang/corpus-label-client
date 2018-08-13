import React, { Component } from 'react'
import {Button} from 'antd'
import { ColorDownList } from "./colorDownList";


export class PatternLine extends Component {
    constructor(props) {
        super(props)
      this.state={
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
        let selection = (window.getSelection) ? window.getSelection(): document.getSelection()
        console.log('select word is called........')
        if(selection.toString().length > 0){
            let selectStartPos = this.calcStartPos(selection.anchorNode.parentNode.id, selection.anchorOffset)
          this.setState({
            showDownlist:true,
            top: e.pageY,
            left: e.pageX,
            selectStartPos: selectStartPos,
            length: selection.toString().length,
            sentence: selection.toString()
          })
        }
    }

    removePattern = () => {
        console.log('pattern id is called')
        this.props.removePatternBy(this.props.patternId)
    }

  hideDownlist = () => {
        this.setState({
          showDownlist: false
        })
  }

  entityOrPhrase = (obj) => {
    this.props.updateSelectLabel(this.props.patternId, {startPos: this.state.selectStartPos, length: this.state.length,id:obj.id,type:obj.type})
  }
    
    render() {
        return (<div><p onMouseUp={this.selectWord}>{this.getSpans()}</p> 
                    <Button onClick={this.removePattern}> 删除</Button>
          {
              this.state.showDownlist?<ColorDownList top={this.state.top} sentence={this.state.sentence} left={this.state.left} intent={this.props.intent} agent={this.props.agent} intentId={this.props.intentId} hideDownlist={this.hideDownlist} entityOrPhrase={this.entityOrPhrase}/>:''
          }

                 </div>)
    }
}

PatternLine.propTypes = { 
    patternId: React.PropTypes.number,
    removePatternBy: React.PropTypes.func,
    pattern :React.PropTypes.object,
    updateSelectLabel: React.PropTypes.func};