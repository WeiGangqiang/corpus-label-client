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

import {serveResult, agentResult, hostResult} from './serve'
import {intendResult, entitySlideResult, entityResult, phraseResult} from './intend';
import {patternResult, predictResult} from './pattern'
import {unknownResult} from './unknown'

const rootReducer = combineReducers({
    routing,
    config: (state = {}) => state,
    tabListResult,
    loginResponse,
    serveResult,
    agentResult,
    intendResult,
    entitySlideResult,
    entityResult,
    phraseResult,
    hostResult,
    patternResult,
    predictResult,
    unknownResult
});

export default rootReducer;
