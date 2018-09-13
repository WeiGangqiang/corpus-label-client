import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Radio, Button, Icon} from 'antd'
const RadioGroup = Radio.Group;


@connect((state, dispatch) => ({}))

export class UnknownPicker extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      value: 0
    }
  }

  onSelectSentence = () => {
    if(this.props.onSelect) {
      this.props.onSelect(this.props.sentence)
    }
  }

  onDelete = () => {
    if(this.props.onDelete) {
      this.props.onDelete(this.props.sentence)
    }
  }

  render() {
    console.log('picker, sentence:', this.props.sentence)
    if (!this.props.sentence) {
      return null
    }
    const {sentence, suggestion} =this.props
    const style = {
      sentence: {
        fontSize: '16px',
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
      }
    }

    return (
      <div style={style.wrapper}>
        <label className="headerTitle">待标注语料:</label>
        {suggestion && suggestion !== sentence ?
        <span>
          <p style={style.sentence}>'原始语料：' + {sentence}</p>
          <p style={style.sentence}>'建议标注语料：' + {suggestion}</p>
        </span>
        : <p style={style.sentence}>正例句：{sentence}</p>
        }
        <div>
          <Button type="danger" onClick={this.onDelete}>废弃<Icon type="delete" /> </Button>
          {suggestion && suggestion != sentence ?
            <Button type="primary" onClick={this.onSelectSentence}> 标注原始语料<Icon type="eye"/> </Button>
            : null
          }
        </div>
      </div>
    )
  }
}

// ReactDOM.render(<Demo />, mountNode);
