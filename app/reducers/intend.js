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
        res = getDisc(res)
        return {data: {...res.children[0]}, loading: false}
    },
}, intendState)

const colorArray = ['#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2'];
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


const colorGreenArray = ['#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7f32', '#aed581', '#9ccc65', '#8bc34a'];
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
