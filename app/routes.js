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

const intentList = (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./pages/intentList').default)
    }, 'intentList')
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
            <Route path="/intentList" query='agent' getComponent={intentList}></Route>
            <Route path="/unknown"  query='agent' getComponent={unknownSays}></Route>
        </Route>
        {/*<Route path="/login" getComponent={Login} />*/}
        {/*<Route path="/register" getComponent={Register} />*/}
    </Router>
)

// export default routes
