import {intend} from 'api'
import {createAjaxAction} from 'utils'
import {createAction} from 'redux-actions';

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

export const fetchCorpus = createAjaxAction(intend.corpus);

export const postCorpus = createAjaxAction(intend.postCorpus);

export const simplifier = createAjaxAction(intend.simplifier);

export const requestPatternList = createAction('request pattern list');
export const receivePatternList = createAction('receive pattern list');
export const getPattern = createAjaxAction(
    intend.getPattern,
    requestPatternList,
    receivePatternList
);

export const postPattern = createAjaxAction(intend.postPattern);

export const putPattern = createAjaxAction(intend.putPattern);

export const deletePattern = createAjaxAction(intend.deletePattern);

export const requestPredictList = createAction('request predict list');
export const receivePredictList = createAction('receive predict list');
export const predict = createAjaxAction(
    intend.predict,
    requestPredictList,
    receivePredictList
)

export const requestPhraseList = createAction('request phrase list');
export const receivePhraseList = createAction('receive phrase list');
export const getPhrase = createAjaxAction(
    intend.getPhrase,
    requestPhraseList,
    receivePhraseList
)

export const postPhrase = createAjaxAction(intend.postPhrase);

export const putPhrase = createAjaxAction(intend.putPhrase);

export const deletePhrase = createAjaxAction(intend.deletePhrase);

export const generate = createAjaxAction(intend.generate);

