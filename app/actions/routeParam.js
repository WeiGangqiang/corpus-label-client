
import {createAjaxAction, createLocalAction} from 'utils'
import {createAction} from 'redux-actions';

export const setRouteParamAction = createAction('set route param');

export const setRouteParam = createLocalAction(
    '',
    setRouteParamAction,
);
