import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb } from 'antd'



export default class BreadcrumbBack extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    console.log(this.props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps, nextState)
    return true
  }
  render() {
    return <div>111</div>
  }
}
