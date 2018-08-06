import { ajax } from 'utils'
import { mockUrl } from '../config'

export const intendList = ajax.fetchJSONByPost('/intents', mockUrl, 'getJson');
export const entityList = ajax.fetchJSONByPost('/parameters', mockUrl, 'getJson');
export const corpus = ajax.fetchJSONByPost('/unknown-says', mockUrl, 'getJson');
export const postCorpus = ajax.fetchJSONByPost('/corpus', mockUrl, 'postJson');
