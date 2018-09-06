import React, {Component} from 'react'
import {Link} from 'react-router'
import {Icon} from 'antd'

export default class Header extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            menuShow: false
        }
    }

    showMenu = () => {
        this.setState({
            menuShow: !this.state.menuShow
        })
    };

    render() {
        return (
           <div className='header-container' >
               <img style={{height: '100%'}} src="images/logo.png" alt=""/>
               <Icon onClick={this.showMenu} className="menu-fold" type="menu-fold" />
               <div className={`sliderBar-container sliderBar-top-container ${this.state.menuShow? 'heightAuto': ''}`}>
                   <div>操作</div>
                   <Link className='sliderItem' activeStyle={{background: '#188ae2', color: '#fff'}} to='/selectService'>我的应用</Link>
                   <Link className='sliderItem'>公共应用</Link>
                   <Link className='sliderItem'>帮助文档</Link>
               </div>
           </div>
        )
    }
}
