import {unknown} from 'api'
import {createAjaxAction, createLocalAction} from 'utils'
import {createAction} from 'redux-actions';

export const requestUnknown = createAction('request unknown list');
export const recevieUnknown = createAction('receive unknown list');

export const unknownList = createAjaxAction(
    unknown.unknown,
    requestUnknown,
    recevieUnknown
)
