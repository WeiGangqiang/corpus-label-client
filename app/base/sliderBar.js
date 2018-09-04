import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'

export default class SliderBar extends Component {
    constructor(props, context) {
        super(props)
    }
    render() {
        return (
            <div className='sliderBar-container'>
                <div>操作</div>
                <Link className='sliderItem' to='/selectService'>我的应用</Link>
                <Link className='sliderItem'>公共应用</Link>
                <Link className='sliderItem'>帮助文档</Link>
            </div>
        )
    }
}
