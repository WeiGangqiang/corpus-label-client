import {
  routerReducer as routing,
} from 'react-router-redux'
import {
  combineReducers,
} from 'redux'

import tabListResult from './tabList'

import {
  loginResponse,
} from './common'

import { serveResult, agentResult, hostResult } from './serve'
import { intendResult, entityResult } from './intend';

const rootReducer = combineReducers({
  routing,
  config: (state = {}) => state,
  tabListResult,

  loginResponse,
  serveResult,
  agentResult,
  intendResult,
  entityResult,
  hostResult,
});

export default rootReducer;
