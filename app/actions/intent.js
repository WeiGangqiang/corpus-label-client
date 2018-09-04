import {intent} from 'api'
import {createAjaxAction} from 'utils'
import {createAction} from 'redux-actions';

export const requestintentList = createAction('request intent list');
export const recevieintentList = createAction('receive intent list');

export const fetchintent = createAjaxAction(
    intent.intentList,
    requestintentList,
    recevieintentList,
);

export const postIntent = createAjaxAction(intent.postIntent);

export const deleteIntent = createAjaxAction(intent.deleteIntent);

export const requestEntityList = createAction('request entity list');
export const receiveEntityList = createAction('receive entity list');

export const fetchEntity = createAjaxAction(
    intent.entityList,
    requestEntityList,
    receiveEntityList,
);

export const fetchCorpus = createAjaxAction(intent.corpus);

export const postCorpus = createAjaxAction(intent.postCorpus);

export const simplifier = createAjaxAction(intent.simplifier);

export const requestPatternList = createAction('request pattern list');
export const receivePatternList = createAction('receive pattern list');
export const getPattern = createAjaxAction(
    intent.getPattern,
    requestPatternList,
    receivePatternList
);

export const postPattern = createAjaxAction(intent.postPattern);

export const putPattern = createAjaxAction(intent.putPattern);

export const deletePattern = createAjaxAction(intent.deletePattern);

export const requestPredictList = createAction('request predict list');
export const receivePredictList = createAction('receive predict list');
export const predict = createAjaxAction(
    intent.predict,
    requestPredictList,
    receivePredictList
)

export const requestPhraseList = createAction('request phrase list');
export const receivePhraseList = createAction('receive phrase list');
export const getPhrase = createAjaxAction(
    intent.getPhrase,
    requestPhraseList,
    receivePhraseList
)

export const postPhrase = createAjaxAction(intent.postPhrase);

export const putPhrase = createAjaxAction(intent.putPhrase);

export const deletePhrase = createAjaxAction(intent.deletePhrase);

export const generate = createAjaxAction(intent.generate);

export const patternsSync = createAjaxAction(intent.patternsSync)

export const requestActionsList = createAction('request actions list');
export const receiveActionsList = createAction('receive actions list');
export const  getIntentActions = createAjaxAction(intent.getIntentActions)

export const  updateIntentActions = createAjaxAction(intent.updateIntentActions)



