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

const colorArray = ['#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2'];
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

