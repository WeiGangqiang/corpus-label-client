import {message} from 'antd'
import {hashHistory} from 'react-router'
import * as ajaxFun from './ajax'

export const ajax = ajaxFun

export function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

export const createAjaxAction = (httpHandle, startAction, endAction) => (reqData, cb, reject, handleCancel) =>
    (dispatch) => {
        startAction && dispatch(startAction())
        httpHandle(reqData, handleCancel)
            .then((resp) => {
                endAction && dispatch(endAction({req: reqData, res: resp.data}))
                return resp.data
            })
            .then((resp) => {
                cb && cb(resp)
            })
            .catch((error) => {
                if (reject) {
                    reject({status: 0, msg: error.message})
                } else {
                    message.error(error.message)
                }
            })
    };

export const createLocalAction = (startAction, endAction) => (reqData) => (dispatch) => {
    startAction && dispatch(startAction());
    endAction && dispatch(endAction({req: reqData}));
}
