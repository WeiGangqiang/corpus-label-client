import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchintent, postIntent, deleteIntent, putIntent, putIntentParameter, addIntentParameter, deleteIntentParameter, fetchEntity, postPattern, postCorpus, predict, getPhrase, putPhrase, deletePhrase, postPhrase, getPattern, getIntentActions} from 'actions/intent'

import {fetchEntityList, certainEntity, updateEntity, deleteEntity, addEntity, entityReference} from 'actions/entity'

import {PatternList, PhraseList, EntityParameters, IntentList, IntentTitle, IntentDesc, EntityTable, ActionsList, EditEntity, EntityDesc} from "components/index";


let agent = '';


// @reactMixin.decorate(Lifecycle)

@connect((state, dispatch) => ({
    config: state.config,
    intentResult: state.intentResult,
    entityResult: state.entityResult,
    entitySlideResult: state.entitySlideResult
}))


export default class IntentDetail extends Component{
    constructor(props){
        super(props)
        this.state = {
            entityParam: [],
            phraseArray: [],
            pattenListKey: 0,
            type: 'positive',
            positivePatterns: [],
            negativePatterns:[],
            actions: [],
        }
    }

    componentWillMount () {
        agent = sessionStorage.getItem('agent');
        const {intentId, name, zhName, modelPath, mode} = this.props.location.query;
        // console.log({intentId, name, zhName, modelPath, mode});
        this.initData({intentId, name, zhName, modelPath, mode})
        // this.props.router.setRouteLeaveHook(this.props.route, () => {
        //     return '当前页面信息不完整，退出可能导致已有信息不可用\n确定要退出当前页面'
        // });

        // this.props.router.listenBefore((route) => {
        //     console.log(route)
        //     // return false
        // })

        // console.log(this.props.router)
    }

    componentDidMount() {

    }

    isEgle = (obj1,obj2) => {
        if(obj1.name == obj2.name && obj1.zhName == obj2.zhName && obj1.modelPath == obj2.modelPath && obj1.mode == obj2.mode && obj1.intentId == obj2.intentId){
            return true
        }
        return false
    };

    componentWillReceiveProps(props){

        if(this.isEgle(props.location.query, this.props.location.query)){

        }else{
            const {intentId, name, zhName, modelPath, mode} = props.location.query;
            this.initData({name,zhName,modelPath,mode,intentId});
        }
    }

    shouldComponentUpdate () {
        return true
    }

    componentDidUpdate(props){
        // console.log(props)
    }

    componentWillUnmount() {
        console.log('unmount')
    }

    initData = (obj) => {
        this.initState(obj);

        this.initEntityParam(obj.intentId, obj.mode);

        this.initPhrase(obj.intentId);

        this.initPattern(obj.intentId);

        this.initAction(obj.intentId);
    };

    initState = (obj) => {
        this.setState({
            name: obj.name,
            zhName: obj.zhName,
            modelPath: obj.modelPath,
            intentId: obj.intentId,
            intentMode: obj.mode
        });
    };

    initEntityParam = (intentId, mode) => {
        this.props.dispatch(fetchEntity('?agent=' + agent + '&intentId=' + intentId, data => {
            for (let i = 0; i < data.length; i++) {
                data[i].valuesF = [...data[i].values]
                for (let j = 0; j < data[i].valuesF.length; j++) {
                    let reg = /[\[\]]/g
                    let labelReg = /\/L[0-9]+/g
                    data[i].valuesF[j] = data[i].valuesF[j].replace(reg, '').replace(labelReg, '').replace(' ','')
                }
                data[i].valuesShow = [...data[i].valuesF.slice(0, 10)]
            }
            if(intentId && mode!='local'){
                this.setState({
                    entityParam: [...data,{
                        name:'',
                        label:'',
                        entity:'',
                        isList:false,
                        values:[],
                        subEntities:[],
                        kind:'',
                        valuesShow: [],
                        valuesF: [],
                        color: ''
                    }]
                })
            }else{
                this.setState({
                    entityParam: [...data]
                })
            }
        }, error => {
            console.log(error)
        }))
    };

    initPhrase = (intentId) => {
        this.props.dispatch(getPhrase('?agent=' + agent + '&intentId=' + intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    };

    initPattern = (intentId) => {
        this.props.dispatch(getPattern('?agent=' + agent + '&intentId=' + intentId + '&type=positive',
            data => {
                this.setState({
                    positivePatterns: data
                })
            },error => {
                console.log(error)
            }));
        this.props.dispatch(getPattern('?agent=' + agent + '&intentId=' + intentId + '&type=negative',
            data => {
                this.setState({
                    negativePatterns: data
                })
            },error => {
                console.log(error)
            }))
    };

    initAction = (intentId) => {
        let entityUrl = '?agent=' + agent + '&intentId=' + intentId;
        this.props.dispatch(getIntentActions(entityUrl, rsp => {
            rsp.data.push({
                type: '',
                values: []
            });
            this.setState({actions: rsp.data})
        }, err=> {

        }))
    }

    addintent = (obj) => {
        this.props.dispatch(postIntent({agent: agent,...obj},data => {
            this.props.dispatch(fetchintent('?agent=' + agent, data => {
                if (data.length) {
                }
            }, error => {
                console.log(error)
            }))
        }, error => {
            console.log(error)
        }))
    };

    editIntent = (param, obj) => {
        this.props.dispatch(putIntent({
            ...param,
            agent: agent
        }, data => {
            this.props.dispatch(fetchintent('?agent=' + agent, data => {
                this.initState(obj)
            }, error => {
                console.log(error)
            }));


        }))
    };

    deleteIntent = (intentId) => {
        this.props.dispatch(deleteIntent('?agent=' + agent + '&intentId=' + intentId,data => {
            this.props.dispatch(fetchintent('?agent=' + agent, data => {
                if (data.length) {
                    this.initData(this.props.intentResult.data.children[0])
                }
            }, error => {
                console.log(error)
            }))
        }, error => {
            console.log(error)
        }))
    };

    showMoreValues = (i) => {
        this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF]
        this.setState({
            entityParam: this.state.entityParam
        })
    };

    showLessValues = (i) => {
        this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF.slice(0, 10)]
        this.setState({
            entityParam: this.state.entityParam
        })
    };

    addIntentParameter = (param,obj) => {
        this.props.dispatch(addIntentParameter({
            ...param,
            agent: agent
        }, data => {
            this.initEntityParam(obj.intentId, obj.mode)
        }, error => {}))
    };

    deleteIntentParameter = (param, obj) => {
        this.props.dispatch(deleteIntentParameter({
            ...param,
            agent: agent
        }, data => {
            this.initEntityParam(obj.intentId, obj.mode);
            this.initPattern(obj.intentId);
        }, error => {}))
    };

    editIntentParameter = (param,obj) => {
        this.props.dispatch(putIntentParameter({
            ...param,
            agent: agent
        }, data => {
            this.initEntityParam(obj.intentId,obj.mode)
        }, error => {}))
    };

    putIntentParameterEntity = (param, obj) => {
        this.props.dispatch(putIntentParameter({
            ...param,
            agent: agent
        }, data => {
            this.initEntityParam(obj.intentId,obj.mode);
            this.initPattern(obj.intentId);
        }, error => {}))
    };

    getPhrase = () => {
        this.props.dispatch(getPhrase('?agent=' + agent + '&intentId=' + this.state.intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    };

    getPatternList = (prop, type) => {
        this.props.dispatch(getPattern('?agent=' + agent + '&intentId=' + prop.intentId + '&type=' + type,
            data => {
                if(type == "positive"){
                    this.setState({positivePatterns: data})
                }
                else{
                    this.setState({negativePatterns: data})
                }
            },error => {
                console.log(error)
            }))
    };

    reloadPatterns = () => {
        this.getPatternList({agentName: agent, intentId: this.state.intentId}, 'positive');
        this.getPatternList({agentName: agent, intentId: this.state.intentId}, 'negative')
    };

    reloadActions = (intentId) => {
        this.initAction(intentId)
    }

    render() {
        const {intentId, name, zhName, modelPath, mode} = this.props.location.query;

        const {intentResult, entitySlideResult} = this.props;

        const style = {
            innerBox: {
                height: '100%'
            },
            headerStyle:{
                background: '#0099CC',
            },
            body: {
                width: '80%'
            },
            modalFoot:{
                height: '52px',
                lineHeight: '32px',
                textAlign: 'right',
                padding: '10px 16px',
                borderTop: '1px solid #e8e8e8'
            },
            modalFootBtn:{
                marginLeft: '8px'
            },

        };

        return (
            <div style={{height: '100%', overflow: 'auto'}}>
                {!intentResult.loading ? <div className="container" style={style.body}>

                    <IntentTitle
                        modelPath={modelPath}
                        agent={agent}
                        mode={mode}
                        addintent={this.addintent}
                    />

                    <IntentDesc
                        name={name}
                        zhName={zhName}
                        modelPath={modelPath}
                        mode={mode}
                        intentId={intentId}
                        editIntent={this.editIntent}
                        deleteIntent={this.deleteIntent}
                    />

                    <EntityParameters
                        intentId={intentId}
                        name={name}
                        zhName={zhName}
                        modelPath={modelPath}
                        mode={mode}
                        agent={agent}
                        entityList={entitySlideResult.children}
                        entityParam={this.state.entityParam}
                        showLessValues={this.showLessValues}
                        showMoreValues={this.showMoreValues}
                        addIntentParameter={this.addIntentParameter}
                        deleteIntentParameter={this.deleteIntentParameter}
                        putIntentParameter={this.editIntentParameter}
                        putIntentParameterEntity={this.putIntentParameterEntity}
                    />

                    <PatternList
                        key={this.state.pattenListKey}
                        agentName={agent}
                        intent={name}
                        intentId={intentId}
                        corpusType={this.state.type}
                        phraseArray={this.state.phraseArray}
                        entityParam={this.state.entityParam}
                        positivePatterns={this.state.positivePatterns}
                        negativePatterns={this.state.negativePatterns}
                        getPatternList={this.getPatternList}
                        updatePhrase={this.getPhrase}
                    />

                    <PhraseList
                        intent={name}
                        agent={agent}
                        intentId={intentId}
                        phraseArray={this.state.phraseArray}
                        updatePhraseArray={this.getPhrase}
                        reloadPatterns={this.reloadPatterns}
                    />

                    <ActionsList
                        agentName={agent}
                        intentId={intentId}
                        intentMode={mode}
                        actions={this.state.actions}
                        reloadActions={this.reloadActions}
                    />
                </div> : ''}
            </div>
        )
    }
}