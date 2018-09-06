import {ajax} from 'utils'
import {mockUrl, host} from '../config'

export const serve = ajax.fetchJSONByPost('/serve', mockUrl, 'getJson');
export const agent = ajax.fetchJSONByPost('/agent/all', mockUrl, 'getJson');
export const deleteAgent = ajax.fetchJSONByPost('/agent', mockUrl, 'deleteForm');
export const addAgent = ajax.fetchJSONByPost('/agent', mockUrl, 'postJson');
export const updateAgent = ajax.fetchJSONByPost('/agent', mockUrl, 'putJson');
export const packageAgent = ajax.fetchJSONByPost('/agent/pack', mockUrl, 'postForm');

