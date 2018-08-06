import { ajax } from 'utils';
import { mockUrl } from '../config';

export const login = ajax.fetchJSONByPost('/login', mockUrl, 'getJson');
export const register = ajax.fetchJSONByPost('/register', mockUrl, 'getJson');
export const userInfo = ajax.fetchJSONByPost('/userInfo', mockUrl, 'postJson');
