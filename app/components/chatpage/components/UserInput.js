import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SendIcon from './icons/SendIcon';
import EmojiIcon from './icons/EmojiIcon';
import EmojiPicker from './emoji-picker/EmojiPicker';


class UserInput extends Component {

  constructor() {
    super();
    this.state = {
      inputActive: false,
    };
  }

  handleKey(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this._submitText(event);
    }
  }

  _submitText(event) {
    event.preventDefault();
    const query = this.userInput.textContent;
    if (query && query.length > 0) {
      this.props.onSubmit({
        from: {
          id: 'testUserId'
        },
        type: 'text',
        data: { query }
      });
      this.userInput.innerHTML = '';
    }
  }

  _handleEmojiPicked(emoji) {
    console.log(emoji)
    this.props.onSubmit({
      from: {
        id: 'testUserId'
      },
      type: 'text',
      data: { query:emoji }
    });
  }

  render() {
    return (
      <form className={`sc-user-input ${(this.state.inputActive ? 'active' : '')}`}>
        <div
          role="button"
          tabIndex="0"
          onFocus={() => { this.setState({ inputActive: true }); }}
          onBlur={() => { this.setState({ inputActive: false }); }}
          ref={(e) => { this.userInput = e; }}
          onKeyDown={this.handleKey.bind(this)}
          contentEditable="true"
          placeholder="输入你的回复..."
          className="sc-user-input--text"
        >
        </div>
        <div className="sc-user-input--buttons">
          <div className="sc-user-input--button"></div>
          <div className="sc-user-input--button">
            {this.props.showEmoji && <EmojiIcon onEmojiPicked={this._handleEmojiPicked.bind(this)} />}
          </div>
          <div className="sc-user-input--button">
            <SendIcon onClick={this._submitText.bind(this)} />
          </div>
        </div>
      </form>
    );
  }
}

UserInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  showEmoji: PropTypes.bool
};

export default UserInput;
