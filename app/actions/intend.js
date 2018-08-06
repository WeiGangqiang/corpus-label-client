import { intend } from 'api'
import { createAjaxAction } from 'utils'
import { createAction } from 'redux-actions';

export const requestIntendList = createAction('request intend list');
export const recevieIntendList = createAction('receive intend list');

export const fetchIntend = createAjaxAction(
  intend.intendList,
  requestIntendList,
  recevieIntendList,
);

export const requestEntityList = createAction('request entity list');
export const receiveEntityList = createAction('receive entity list');

export const fetchEntity = createAjaxAction(
  intend.entityList,
  requestEntityList,
  receiveEntityList,
);

export const fetchCorpus = createAjaxAction(intend.corpus)

export const postCorpus = createAjaxAction(intend.postCorpus)
