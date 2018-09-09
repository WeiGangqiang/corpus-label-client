
import axios from 'axios'
import {prefix, suffix, timeout, useMock} from '../config'

axios.interceptors.request.use(function (config) {
    if(config.method=='get'){
        if(config.url.indexOf('?')>=0){
            config.url += '&user=darwin'
        }else{
            config.url += '?user=darwin'
        }
    }else if(config.method=='post' || config.method == 'put' || config.method == 'delete'){
        if(config.headers['Content-Type'].indexOf('json')>0){
            if(config.data){
                config.data = {...config.data, user: 'darwin'}
            }else{
                config.data = {user: 'darwin'}
            }
        }else{
            if(config.url.indexOf('?')>=0){
                config.url += '&user=darwin'
            }else{
                config.url += '?user=darwin'
            }
        }
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

const ajaxHttp = {
    getForm: function (url, data) {
        return axios({
            method: 'get',
            url: url + data,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
    },
    getJson: function (url, data) {
        return axios({
            method: 'get',
            url: url + data,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json;charset=utf-8;',
            },
        })
    },
    postForm: function (url, data) {
        return axios({
            method: 'post',
            url:url + data,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        })
    },
    postJson: function (url, data) {
        return axios({
            method: 'post',
            url,
            data,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    },
    putJson: function (url, data) {
        return axios({
            method: 'put',
            url,
            data,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    },
    deleteJson: function (url, data) {
        return axios({
            method: 'delete',
            url,
            data,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    },
    deleteForm: function (url, data) {
        return axios({
            method: 'delete',
            url: url + data,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
    }
}

function axiosPost(url, reqData, target, sign, handleCancel) {
    let newUrl;
    if (useMock) {
        newUrl = `${target}${url}${suffix}`
    } else {
        newUrl = `${prefix}${url}`
    }
    if (useMock) {
        return ajaxHttp.getJson(newUrl)
    }
    switch (sign) {
        case 'getForm':
            return ajaxHttp.getForm(newUrl, reqData);
        case 'getJson':
            return ajaxHttp.getJson(newUrl, reqData);
        case 'postForm':
            return ajaxHttp.postForm(newUrl, reqData);
        case 'postJson':
            return ajaxHttp.postJson(newUrl, reqData);
        case 'putJson':
            return ajaxHttp.putJson(newUrl, reqData);
        case 'deleteJson':
            return ajaxHttp.deleteJson(newUrl, reqData);
        case 'deleteForm':
            return ajaxHttp.deleteForm(newUrl, reqData);
        default:
            return ajaxHttp.postJson(newUrl, reqData)
    }
}

const fetchJSONByPost = (url, target, sign) => (reqData, handleCancel) => axiosPost(url, reqData, target, sign, handleCancel)

export {
    fetchJSONByPost
}
