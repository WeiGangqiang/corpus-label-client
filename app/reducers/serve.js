import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
import { message } from 'antd'

const host = sessionStorage.getItem('agentName');

// const serveState = () => []

const serveState = {
  data: [],
  loading: true,
}

export const serveResult = handleActions({
    'request serve list'(state, action) {
        return {...state}
    },
    'receive serve list'(state, action) {
        const { req, res } = action.payload
        return {data: res.data, loading: false}
    },
}, serveState)

// const agentState = () => [];

const agentState = {
  data: [],
  loading: true,
}

export const agentResult = handleActions({
  'request agent list'(state, action) {
      return { ...state }
  },
  'receive agent list'(state, action) {
      const { req, res } = action.payload;
      let arr = [];
      res.map( (item, index) => {
        arr[index] = {};
        arr[index].name = item;
        arr[index].id = index - (-1)
      })
      return { data: arr, loading: false}
  },
  'set agent name'(state, action) {
    return
  }
},agentState)


const hostState = host == null ? [] : [ host ];

export const hostResult = handleActions({
  'set agent name'(state, action) {
    return [ ...hostState ]
  }
},hostState)
