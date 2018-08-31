import {handleActions} from 'redux-actions'
import {hasResponseError} from 'utils'

const unknownState = {
    data: [],
    loading: true,
}
export const unknownResult = handleActions({
    'request unknown list'(state, action) {
        return {...state}
    },
    'receive unknown list'(state, action) {
        let {req, res} = action.payload;
        res.map((item,index) => {
            res[index] = {
                sentence: item,
                labels: []
            }
        })
        return {data:[...res], loading: false}
    },
}, unknownState)

