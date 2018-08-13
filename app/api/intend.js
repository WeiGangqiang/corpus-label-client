import {ajax} from 'utils'
import {mockUrl} from '../config'

export const intendList = ajax.fetchJSONByPost('/intents', mockUrl, 'getJson');

export const entityList = ajax.fetchJSONByPost('/parameters', mockUrl, 'getJson');

export const corpus = ajax.fetchJSONByPost('/unknown-says', mockUrl, 'getJson');

export const postCorpus = ajax.fetchJSONByPost('/corpus', mockUrl, 'postJson');

export const simplifier = ajax.fetchJSONByPost('/simplifier', mockUrl, 'postJson');

export const getPattern = ajax.fetchJSONByPost('/pattern', mockUrl, 'getJson');

export const postPattern = ajax.fetchJSONByPost('/pattern', mockUrl, 'postJson');

export const putPattern = ajax.fetchJSONByPost('/pattern', mockUrl, 'putJson');

export const deletePattern = ajax.fetchJSONByPost('/pattern', mockUrl, 'deleteJson');

export const getPhrase = ajax.fetchJSONByPost('/phrase', mockUrl, 'getJson');

export const postPhrase = ajax.fetchJSONByPost('/phrase', mockUrl, 'postJson');

export const putPhrase = ajax.fetchJSONByPost('/phrase', mockUrl, 'putJson');

export const deletePhrase = ajax.fetchJSONByPost('/phrase', mockUrl, 'deleteJson');

export const predict = ajax.fetchJSONByPost('/label/predict', mockUrl, 'postJson');

export const generate = ajax.fetchJSONByPost('/generate', mockUrl, 'postJson');


