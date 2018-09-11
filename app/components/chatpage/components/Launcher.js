import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChatWindow from './ChatWindow';
import launcherIcon from './../assets/avatar1.png';
import launcherIconActive from './../assets/close-icon.png';
import {Button, Row, Col} from 'antd'

class Launcher extends Component {

  constructor() {
    super();
    this.state = {
      launcherIcon,
      isOpen: false
    };
  }

  handleClick() {
    if (this.props.handleClick !== undefined) {
      this.props.handleClick();
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    }
  }

  _renderButton() {
    return <Row>
      <Col sm={24} xs={0}>
        <Button type="primary" icon="message" ghost size="large" className={"sc-chat-desc"}>和小哒聊天</Button>
      </Col>
      <Col xs={24} sm={0}>
      <Button type="primary" icon="message" shape="circle" size="large" className={"sc-chat-desc"}></Button>
      </Col>
    </Row>
  }

  render() {
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen;
    const classList = [
      'sc-launcher',
      (isOpen ? 'opened' : ''),
    ];
    return (
      <div>
        <div>
        </div>
        <div className={"sc-launcher-wrapper"} onClick={this.handleClick.bind(this)}>
          
          {isOpen?'':this._renderButton()}
          <div className={classList.join(' ')} >
            <img className={"sc-open-icon"} src={launcherIconActive} />
          </div>
        </div>

        <ChatWindow
          messageList={this.props.messageList}
          onUserInputSubmit={this.props.onMessageWasSent}
          agentProfile={this.props.agentProfile}
          isOpen={isOpen}
          onClose={this.handleClick.bind(this)}
          showEmoji={this.props.showEmoji}
        />
      </div>
    );
  }
}

const MessageCount = (props) => {
  if (props.count === 0 || props.isOpen === true) { return null }
  return (
    <div className={"sc-new-messsages-count"}>
      {props.count}
    </div>
  )
}

Launcher.propTypes = {
  onMessageWasReceived: PropTypes.func,
  onMessageWasSent: PropTypes.func,
  newMessagesCount: PropTypes.number,
  isOpen: PropTypes.bool,
  handleClick: PropTypes.func,
  messageList: PropTypes.arrayOf(PropTypes.object),
  showEmoji: PropTypes.bool
};

Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true
}

export default Launcher;
