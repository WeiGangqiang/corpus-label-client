import React, {Component} from 'react';
import {Row, Col, Button} from 'antd'


export class UnknownItem extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    // this.addActiveClass= this.addActiveClass.bind(this);
  }
  deleteMe = () => {
    if (this.props.deleteMe) {
      this.props.deleteMe(this.props.index)
    }
  }
  pickMe = () =>  {
    if (this.props.pickMe) {
      this.props.pickMe(this.props.index)
    }
  }

  onSelect = () =>  {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.index)
    }
  }

  getDisplayMode = () => {
    if (this.props.hideSave) {
      return 'none'
    }
    return 'inline'
  }

  render() {
    const style = {
      title: {
        width: '100%',
        paddingTop: '10px',
        height: '40px',
        lineHeight: '40px',
        padding: '0',
        margin: '0'
      }
    }
    return (
      <div style={style.title}>
        <Row>
          <Col span={18}>
            <div>
              <label onClick={this.onSelect}>{this.props.content}</label>
            </div>
          </Col>
          <Col span={6}>
            <div style={{float: 'right'}}>
              <Button onClick={this.deleteMe} icon="delete"></Button>

              <Button disabled={!this.props.intentId}
                onClick={this.pickMe}
                icon="save"
                style={{display: this.getDisplayMode()}}
              ></Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

// ReactDOM.render(<Demo />, mountNode);
