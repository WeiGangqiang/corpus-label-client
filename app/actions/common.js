import {
    createAction,
} from 'redux-actions'
import {
    common,
} from 'api'
import {
    createAjaxAction,
    fakeAjaxAction,
} from 'utils'


// export const requestAmList = createAction('request am list')
// export const recevieAmList = createAction('receive am list')
// export const fetchAmList = createAjaxAction(common.amList, requestAmList, recevieAmList)
// export const resetAmList = createAction('reset am list')
export const postLogin = createAjaxAction(common.login)
export const fetchRegister = createAjaxAction(common.register)
export const userInfo = createAjaxAction(common.userInfo)

