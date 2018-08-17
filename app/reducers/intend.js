import {handleActions} from 'redux-actions'
import {hasResponseError} from 'utils'
import {getDisc} from 'utils/util'
import {message} from 'antd'


// const intendState = () => []

const intendState = {
    data: {},
    loading: true,
}
export const intendResult = handleActions({
    'request intend list'(state, action) {
        return {...state}
    },
    'receive intend list'(state, action) {
        let {req, res} = action.payload;
        res = getDisc(res).children[0]
        return {data: {...res.children[0]}, loading: false}
    },
}, intendState)

// const colorArray = ['#4c32e8', '#0000FF', '#5c6bc0', '#4169E1', '#1E90FF', '#87CEFA', '#00BFFF', '#0288d1', '#4b4fd0', '#0d47a1'];
// const colorArray = ['#f3a42d', '#fbb20e', '#f7a324', '#FF9800', '#ffcc33'];
const colorArray = ['#b9721c', '#b2b91c', '#64b91c', '#721cb9', '#ffcc33'];
const entityState = () => [];
export const entityResult = handleActions({
    'request entity list'(state, action) {
        return [...state]
    },
    'receive entity list'(state, action) {
        const {req, res} = action.payload;
        res.map((item, index) => {
            item.color = colorArray[index >= colorArray.length ? index - colorArray.length : index]
        });
        return [...res]
    },
}, entityState())


// const colorGreenArray = ['#80cbc4', '#009688', '#00695c', '#00bfa5', '#81c784', '#43a047', '#2e7d32', '#00e676', '#8bc34a', '#64dd17'];
const colorGreenArray = ['#0080ff', '#1cb2b9', '#b91c63', '#00bfa5', '#81c784'];
const phraseState = () => [];
export const phraseResult = handleActions({
    'request phrase list'(state, action) {
        return [...state]
    },
    'receive phrase list'(state, action) {
        const {req, res} = action.payload;
        res.map((item, index) => {
            item.color = colorGreenArray[index >= colorGreenArray.length ? index - colorGreenArray.length : index]
        });
        return [...res]
    },
}, phraseState())
