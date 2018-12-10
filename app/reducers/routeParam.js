import {handleActions} from 'redux-actions'

const routeState = {
    data: localStorage.getItem('routeParam') ? JSON.parse(localStorage.getItem('routeParam')) : {}
}

export const routeResult = handleActions({
    'set route param'(state, action) {
        const {req} = action.payload;
        localStorage.setItem('routeParam', JSON.stringify(req))
        return {data: req}
    }
}, routeState)



