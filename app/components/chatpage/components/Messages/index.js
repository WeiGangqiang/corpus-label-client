import React, { Component } from 'react'
import SentTextMessage from './sent/SentTextMessage'
import ReceivedTextMessage from './received/ReceivedTextMessage'
import EmojiMessage from './EmojiMessage'
import chatIconUrl from './../../assets/avatar1.png'


class Message extends Component {

  _renderMessageOfType(type) {
    switch(type) {
      case 'text':
        return <TextMessage {...this.props.message} />
      case 'emoji':
        return <EmojiMessage {...this.props.message} />
    }
  }

  _renderMessageOfSource() {
    if (this.props.message.from) {
      return this._renderSentMessage() 
    } else {
      return this._renderReceivedMessage()
    }
  }

  _renderSentMessage() {
    return (
      <div className="sc-message">
        <div className="sc-message--content sent">
          <div className="sc-message--avatar" style={{
              backgroundImage: `url(${chatIconUrl})`
            }}></div>
          {this._renderSentMessageOfType(this.props.message.type)}
        </div>
      </div>
    )
  }

  _renderSentMessageOfType(type) {
    switch(type) {
      case 'text':
        return <SentTextMessage {...this.props.message}/>
    }
  }

  _renderReceivedMessage() {
    return (
      <block>
        {this.props.message.msgs.filter((message)=>{
          return message.type == 'text'
        })
        .map((message,i) => {
          return (
            <div className="sc-message" key={i}>
              <div className="sc-message--content received">
                <div className="sc-message--avatar"></div>
                {this._renderReceivedMessageOfType(message)}
              </div>
            </div>
          )
        })}
      </block>
    )
  }

  _renderReceivedMessageOfType(message) {
    switch(message.type) {
      case 'text':
        return <ReceivedTextMessage {...message}/>
    }
  }

  render () {
    return this._renderMessageOfSource()
  }
}

export default Message