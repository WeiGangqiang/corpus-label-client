import { handleActions } from 'redux-actions'
import { hasResponseError } from 'utils'
import { message } from 'antd'


// const intendState = () => []

const intendState = {
  data: [],
  loading: true,
}

export const intendResult = handleActions({
  'request intend list'(state, action) {
    return { ...state }
  },
  'receive intend list'(state, action) {
    const { req, res } = action.payload;
    return { data: res, loading: false }
  },
}, intendState)

const colorArray = ['#05a8aa', '#09aa40', '#f3f60b', '#fa8107', '#fd3709', '#c20133', '#aa0891', '#6406b8', '#0c07f8', '#09bffd'];
const entityState = () => [];
export const entityResult = handleActions({
  'request entity list'(state, action) {
    return [...state]
  },
  'receive entity list'(state, action) {
    const { req, res } = action.payload;
    res.map((item, index) => {
      item.color = colorArray[index > 9 ? index - 9 : index]
    });
    return [...res]
  },
}, entityState())

