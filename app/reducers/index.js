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
import {intentResult, entitySlideResult, entityResult, phraseResult,actionsResult} from './intent';
import {patternResult, predictResult} from './pattern'
import {unknownResult} from './unknown'
import {routeResult} from './routeParam'

const rootReducer = combineReducers({
    routing,
    config: (state = {}) => state,
    tabListResult,
    loginResponse,
    serveResult,
    agentResult,
    intentResult,
    entitySlideResult,
    entityResult,
    phraseResult,
    hostResult,
    patternResult,
    predictResult,
    unknownResult,
    actionsResult,
    routeResult
});

export default rootReducer;
