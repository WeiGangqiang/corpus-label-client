import {handleActions} from 'redux-actions'
import {hasResponseError} from 'utils'
import {getDisc} from 'utils/util'

const intentState = {
    data: {},
    loading: true,
}
export const intentResult = handleActions({
    'request intent list'(state, action) {
        return {...state}
    },
    'receive intent list'(state, action) {
        let {req, res} = action.payload;
        if (res.length) {
            // let modelPath = res[0].modelPath.split('/')[0]
            res = getDisc(res).children[0].children[0].children[0];
            // res.key = modelPath;
            res.title = '意图';
            res.name = '意图';
            res.modelPath = res.key;
            res.valid = true;
            return {data: {...res}, loading: false}
        } else {
            return {data:
                    {
                        key:'意图',
                        title:'意图',
                        intentId: '',
                        modelPath: "",
                        name: '意图',
                        zhName: '',
                        children: [],
                        valid: true

                }, loading: false}
        }
    },
}, intentState)

const entityListState = {
    data: {}
}
export const entitySlideResult = handleActions({
    'request entity slide list'(state, action) {
        return {...state}
    },
    'receive entity slide list'(state, action) {
        let {res} = action.payload;
        let rootObj = {
            key: '实体',
            title: '实体',
            children: [],
            entityId: '',
            valid: true
        };
        res.map((item, index) => {
            rootObj.children.push({
                key: item.name,
                title: item.name,
                children: [],
                valid: item.valid,
                entityId: 'entity' + index
            })
        });
        return {...rootObj}
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
        return [...res]
    },
}, phraseState())


export const actionsResult = handleActions({
    'request actions list'(state, action) {
        console.log('handle actions request phrase list')
        return [...state]
    },
    'receive actions list'(state, action) {
        const {req, res} = action.payload;
        console.log('handle actions receive phrase list',res)
        let newRes = res.data.map( (item) => {
            item.type = "文本"
        })
        return [...newRes]
    },
}, [])
