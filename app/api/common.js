import {ajax} from 'utils';
import {mockUrl} from '../config';

export const login = ajax.fetchJSONByPost('/user/login', mockUrl, 'postJson');
export const logout = ajax.fetchJSONByPost('/user/logout', mockUrl, 'postJson')
export const register = ajax.fetchJSONByPost('/register', mockUrl, 'getJson');
export const userInfo = ajax.fetchJSONByPost('/userInfo', mockUrl, 'postJson');
