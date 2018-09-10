import React, {Component} from 'react';
import axios from 'axios'
import {Launcher} from './index'

export class ChatPage extends Component {
  constructor() {
    super();
    this.state = {
      messageList: []
    };
  }

  _pushMessage(message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    })
  }

  _onMessageWasSent(message) {
    this._pushMessage(message)
    axios.post('http://106.15.177.105/westore/chatbot', message)
      .then((response) => {
        this._pushMessage(response.data)
      })
  }

  _sendMessage(text) {
    if (text.length > 0) {
      this.setState({
        messageList: [...this.state.messageList, {
          author: 'them',
          type: 'text',
          data: { text }
        }]
      })
    }
  }

  render() {
    return (<div>
      <Launcher
        agentProfile={{
          teamName: '小哒',
          imageUrl: 'https://xiaodamp.cn/asstbot/image/avatar1.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}
        showEmoji
      />
    </div>)
  }
}
