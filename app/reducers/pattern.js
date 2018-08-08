import { handleActions } from 'redux-actions'

const patternState = {
  data: [],
  loading: true
}

export const patternResult = handleActions({
  'request pattern list'(state, action) {
    return { ...state }
  },
  'receive pattern list'(state, action) {
    const { req, res } = action.payload;
    return { data: res, loading: false }
  }
}, patternState)


const predictState ={
  "pattern"  : {
    "sentence": "",
    "labels": []
  },
  "intentId" : "",
  "intent"   : "",
  "agent"    : ""
}

export const predictResult = handleActions({
  'request predict list'(state, action) {
    return {...state, ...action, pattern: {...state.pattern, sentence: action.sentence}}
  },
  'receive predict list'(state, action) {
    const {req, res} = action.payload;
    return {...state, pattern:{...state.pattern, labels:[...state.pattern.labels, ...req]}}
  }
}, predictState)



