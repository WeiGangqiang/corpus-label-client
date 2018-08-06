import { ajax } from 'utils'
import { mockUrl, host } from '../config'

export const serve = ajax.fetchJSONByPost('/serve', mockUrl, 'getJson');
export const agent = ajax.fetchJSONByPost('/agents', mockUrl, 'getJson');
