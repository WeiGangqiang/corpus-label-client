import React, {Component} from 'react'
// import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {message} from 'antd'
import 'style/base.less'

import Header from './header'
import BreadcrumbBack from './breadcrumb'
import SliderBar from './sliderBar'

@connect((state, props) => ({}))
export default class App extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            pathname: ''
        }
    }

    componentWillMount () {
        this.props.router.listen(route => {
            console.log(this)
            this.setState({
                pathname: route.pathname
            })
        })
    }

    componentDidMount () {
        this.setState({
            pathname: this.props.location.pathname
        })
        this.props.router.listen(route => {
            this.setState({
                pathname: route.pathname
            })
        })
    }

    render() {
        const {location, children} = this.props
        const style = {
            pageContent: {
                background: '#fff',
            },
        }
        return (
            <div id="container" className={`effect easeInOutBack ${(this.state.pathname == '/corpusLabel' || this.state.pathname == '/unknown') ? "" : "slider-padding header-padding"}`}
            >
                {
                    (this.state.pathname == '/corpusLabel' || this.state.pathname == '/unknown') ? '' : <Header pathname={this.state.pathname}/>
                }
                {
                    (this.state.pathname == '/corpusLabel' || this.state.pathname == '/unknown') ? '' : <SliderBar/>
                }
                <div className="boxed">
                    <div className='boxed'>
                        <div id="content-container" className="content-container">
                            <div style={style.pageContent} id="page-content">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
