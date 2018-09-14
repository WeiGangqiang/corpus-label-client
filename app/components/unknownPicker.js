import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Radio, Button, Icon} from 'antd'
const RadioGroup = Radio.Group;

@connect((state, dispatch) => ({}))

export class UnknownPicker extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  onSelectSentence = () => {
    console.log('onSelectSentence')
    if(this.props.onRejectSuggestion) {
      this.props.onRejectSuggestion()
    }
  }

  onDelete = () => {
    if(this.props.onDelete) {
      this.props.onDelete(this.props.sentence)
    }
  }

  render() {
    const style = {
      sentence: {
        fontSize: '16px',
        width: '100%',
        margin: '5px 0',
        borderBottom: '1px solid #dadada'
      },
      title: {
        fontSize: '16px',
        fontWeight:'bold',
        width: '100%',
        margin: '5px 0'
      },
      radio: {
        width: '100%',
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      wrapper: {
        border: '2px solid #dadada',
        marginTop: '20px',
        padding: '10px',
        borderRadius: '5px'
      },
      rightItem:{
        float: 'right',
        marginTop: '5px',
        marginLeft: '10px',
        cursor:'pointer'
      },
      btn: {
        marginLeft: '10px'
      }
    }

    // console.log('picker, sentence:', this.props.sentence)
    // console.log('picker, suggestion:', this.props.suggestion)
    const {sentence, suggestion, acceptSuggestion} = this.props
    if (!this.props.sentence) {
      return null
    }
    // console.log('picker, acceptSuggestion', acceptSuggestion)
    return (
      <div style={style.wrapper}>
        <label className="headerTitle">待标注语料:</label>
        { acceptSuggestion && suggestion && suggestion !== sentence ?
        <span>
          <p style={style.title}>原始语料：</p>
          <p style={style.sentence}>{sentence}</p>
          <p style={style.title}>建议标注例句：</p>
          <p style={style.sentence}>{suggestion}</p>
        </span>
        : <p style={style.sentence}>标注例句：{sentence}</p>
        }
        <div>
          <Button type="danger" style={style.btn} onClick={this.onDelete}>废弃<Icon type="delete" /> </Button>
          {acceptSuggestion && suggestion && suggestion !== sentence ?
            <Button type="primary" style={style.btn} onClick={this.onSelectSentence}>标注原始语料<Icon type="eye"/> </Button>
            : null
          }
        </div>
      </div>
    )
  }
}

// ReactDOM.render(<Demo />, mountNode);
