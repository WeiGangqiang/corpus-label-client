import {handleActions} from 'redux-actions'
import {hasResponseError} from 'utils'
import {getDisc} from 'utils/util'

const intendState = {
    data: {},
    loading: true,
}
export const intendResult = handleActions({
    'request intend list'(state, action) {
        return {...state}
    },
    'receive intend list'(state, action) {
        let {req, res} = action.payload;
        if (res.length) {
            res = getDisc(res).children[0]
            console.log(res)
            res.key = '意图'
            res.title = '意图'
            return {data: {...res}, loading: false}
        } else {
            return {data:
                    {
                        key:'意图',
                        title:'意图',
                        intentId: '',
                        modelPath: "",
                        name: '',
                        zhName: '',
                        children: []

                }, loading: false}
        }
    },
}, intendState)

const entityListState = {
    data: {}
}
export const entitySlideResult = handleActions({
    'request entity slide list'(state, action) {
        return {...state}
    },
    'receive entity slide list'(state, action) {
        let {req, res} = action.payload;
        if (res.length) {
            // res = getDisc(res).children[0]
            console.log(res)
            res.key = '实体'
            res.title = '实体'
            return {data: {...res}}
        } else {
            return {data:
                    {
                        key:'实体',
                        title:'实体',
                        children: []

                    }, loading: false}
        }
    }
}, entityListState)


const colorArray = ['#64B8CF', '#FAB900', '#90BB23', '#EE7008', '#1AB39F'];
const entityState = () => [];
export const entityResult = handleActions({
    'request entity list'(state, action) {
        return [...state]
    },
    'receive entity list'(state, action) {
        const {req, res} = action.payload;
        res.map((item, index) => {
            item.color = colorArray[index >= colorArray.length ? index - colorArray.length : index]
        });
        return [...res]
    },
}, entityState())

const colorGreenArray = ['#90C226', '#54A021', '#E6B91E', '#E76618', '#C42F1A'];
const phraseState = () => [];
export const phraseResult = handleActions({
    'request phrase list'(state, action) {
        return [...state]
    },
    'receive phrase list'(state, action) {
        const {req, res} = action.payload;
        res.map((item, index) => {
            item.color = colorGreenArray[index >= colorGreenArray.length ? index - colorGreenArray.length : index]
        });
        res.push({
            color: "green",
            intentId: "",
            phraseId: "",
            similars: []
        })
        console.log(res)
        return [...res]
    },
}, phraseState())
