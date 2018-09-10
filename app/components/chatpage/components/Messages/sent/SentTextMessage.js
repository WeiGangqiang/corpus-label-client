import React, { Component } from 'react';

const SentTextMessage = (props) => {
  return <div className="sc-message--text">{props.data.query}</div>
}

export default SentTextMessage