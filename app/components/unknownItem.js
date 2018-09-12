import React, {Component} from 'react';
import {Row, Col, Icon} from 'antd'


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
    return 'inline-block'
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
      },
      colRight:{
        float: 'right',
        marginTop: '5px',
        marginLeft: '10px',
        cursor:'pointer'
      },
      delete:{
        marginTop: '5px',
        fontSize :'20px',
        height:'40px'
      }
    }
    return (
      <div style={style.title}>
        <Row>
          <Col style={style.colRight}>
            <span> <Icon type="delete"
                         style={style.delete}
                         onClick={this.deleteMe} />
            </span>
          </Col>
          <Col style={style.colRight}>
            <span> <Icon type="appstore-o"
                         style={{marginTop: '5px', fontSize :'20px', height:'40px', display: this.getDisplayMode()}}
                         onClick={this.pickMe} />
            </span>
          </Col>
          <Col>
            <div>
              <label onClick={this.onSelect}>{this.props.content}</label>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

// ReactDOM.render(<Demo />, mountNode);
