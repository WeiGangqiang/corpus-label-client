import { serve } from 'api'
import { createAjaxAction, createLocalAction } from 'utils'
import { createAction } from 'redux-actions';

export const requestServeList = createAction('request serve list');
export const recevieServeList = createAction('receive serve list');

export const fetchServe = createAjaxAction(
  serve.serve,
  requestServeList,
  recevieServeList,
);

export const requestAgentList = createAction('request agent list');
export const receiveAgentList = createAction('receive agent list');

export const fetchAgent = createAjaxAction(
  serve.agent,
  requestAgentList,
  receiveAgentList,
);

export const agentName = createAction('set agent name');
export const setAgentName = createLocalAction('', agentName);
