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

const colorArray = ['#4c32e8', '#0000FF', '#5c6bc0', '#4169E1', '#1E90FF', '#87CEFA', '#00BFFF', '#0288d1', '#4b4fd0', '#0d47a1'];
const entityState = () => [];
export const entityResult = handleActions({
    'request entity list'(state, action) {
        return [...state]
    },
    'receive entity list'(state, action) {
        const {req, res} = action.payload;
        res.map((item, index) => {
            item.color = colorArray[index > 9 ? index - 9 : index]
        });
        return [...res]
    },
}, entityState())


const colorGreenArray = ['#80cbc4', '#009688', '#00695c', '#00bfa5', '#81c784', '#43a047', '#2e7d32', '#00e676', '#8bc34a', '#64dd17'];
const phraseState = () => [];
export const phraseResult = handleActions({
    'request phrase list'(state, action) {
        return [...state]
    },
    'receive phrase list'(state, action) {
        const {req, res} = action.payload;
        res.map((item, index) => {
            item.color = colorGreenArray[index > 9 ? index - 9 : index]
        });
        return [...res]
    },
}, phraseState())
