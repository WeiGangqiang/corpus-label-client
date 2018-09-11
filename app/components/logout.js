import React, {Component} from 'react'
import {Icon} from 'antd'
import {logout} from 'api/common'
import {hashHistory} from 'react-router'

export class Logout extends Component {
  constructor() {
    super();
  }

  logout() {
    console.log('logout')
    logout("").then(() => {
      sessionStorage.setItem("isUserLogged", false)
      hashHistory.push('/login')
    })
  }

  render() {
    return (
    <div className='menu-logout' onClick={this.logout}>
      <Icon type='logout'>
      </Icon>
      <span className="menu-logout-more">注销</span>
    </div>)
  }
}
