import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import hashHistory from './history'
import axios from 'axios'

import App from './base'
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config
    }, function (error) {
    // Do something with request error
    return Promise.reject(error);
})

axios.interceptors.response.use(function (response) {
    // Do something with response data
        if (response.data.retCode === '401') {
            console.log(response.data)
            hashHistory.push('/login')
        } else {
            return response
        }
    }, 
    function (error) {
    // Do something with response error
    return Promise.reject(error);
})

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

function requireAuth(nextState, replaceState) {
    console.log(sessionStorage.getItem('isUserLogged'))
    if( !sessionStorage.getItem('isUserLogged')) {
        replaceState({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
        })
    }
  }

export default () => (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute getComponent={selectService}/>
            <Route path="/selectService" getComponent={selectService} onEnter={requireAuth}/>
            <Route path="/intentList" query='agent' getComponent={intentList} onEnter={requireAuth}></Route>
            <Route path="/unknown"  query='agent' getComponent={unknownSays} onEnter={requireAuth}></Route>
        </Route>
        <Route path="/login" getComponent={Login} />
        <Route path="/register" getComponent={Register} />
    </Router>
)

// export default routes
