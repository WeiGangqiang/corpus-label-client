import {ajax} from 'utils'
import {mockUrl, host} from '../config'

export const entityList = ajax.fetchJSONByPost('/entity/all', mockUrl, 'getForm');
export const Entity = ajax.fetchJSONByPost('/entity', mockUrl, 'getForm');
export const addEntity = ajax.fetchJSONByPost('/entity', mockUrl, 'postJson');
export const updateEntity = ajax.fetchJSONByPost('/entity', mockUrl, 'putJson');
export const deleteEntity = ajax.fetchJSONByPost('/entity', mockUrl, 'deleteForm');
export const entityReference = ajax.fetchJSONByPost('/entity/reference', mockUrl, 'getForm');