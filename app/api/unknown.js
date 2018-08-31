import {ajax} from 'utils'
import {mockUrl, host} from '../config'

export const unknown = ajax.fetchJSONByPost('/unknown-says', mockUrl, 'getForm');


