import React, {Component} from 'react'

export default class Header extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
    }

    componentWillMount () {
        //console.log(this.props)     //可监测到刷新，但是值为空
    }

    componentDidMount () {
        //console.log(this.props)         //可监测到刷新，但是值为空
    }

    componentWillReceiveProps (prop) {
        //console.log(prop)               //监测不到f5刷新
    }

    shouldComponentUpdate (prop) {
        // console.log(prop);
        return true
    }

    componentWillUpdate (prop) {
        // console.log(prop)
    }

    componentDidUpdate (prop) {
        //console.log(prop)   //可以监测到变化，f5刷新监测不到
    }

    componentWillUnmount () {
        // console.log(this.props)
    }

    render() {
        return (
           <div className='header-container' ><img style={{height: '100%'}} src="images/logo.png" alt=""/></div>
        )
    }
}
