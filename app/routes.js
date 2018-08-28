import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import hashHistory from './history'

import App from './base'


// 登录
const Login = (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./pages/login').default)
    }, 'login')
}

// 注册
const Register = (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./pages/register').default)
    }, 'register')
};

const selectService = (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./pages/agent').default)
    }, 'selectService')
};

const intendList = (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./pages/intendList').default)
    }, 'intendList')
};

const unknownSays = (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./pages/unknownSays').default)
    }, 'unknownSays')
}

/* 进入路由的判断 */
function isLogin(nextState, replaceState) {
    // const token = sessionStorage.getItem('token')
    // if (!token) {
    //   replaceState('/selectService')
    // } else {
    // replaceState('/selectService')
    // }
}

export default () => (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute getComponent={selectService}/>
            <Route path="/selectService" getComponent={selectService}/>
            <Route path="/intendList" getComponent={intendList}></Route>
            <Route path="/unknown" getComponent={unknownSays}></Route>
        </Route>
        {/*<Route path="/login" getComponent={Login} />*/}
        {/*<Route path="/register" getComponent={Register} />*/}
    </Router>
)

// export default routes
