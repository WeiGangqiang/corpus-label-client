import {entity} from 'api'
import {createAjaxAction, createLocalAction} from 'utils'
import {createAction} from 'redux-actions';

export const requestEntityList = createAction('request entity slide list');
export const receiveEntityList = createAction('receive entity slide list');

export const fetchEntityList = createAjaxAction(
    entity.entityList,
    requestEntityList,
    receiveEntityList,
);

export const certainEntity = createAjaxAction(entity.Entity);

export const deleteEntity = createAjaxAction(entity.deleteEntity);

export const addEntity = createAjaxAction(entity.addEntity);

export const updateEntity = createAjaxAction(entity.updateEntity);

export const entityReference = createAjaxAction(entity.entityReference)
