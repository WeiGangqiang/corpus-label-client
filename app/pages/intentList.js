import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form} from 'antd'
import {isArrayDomain} from 'utils/util'
import {fetchintent, postIntent, deleteIntent, putIntent, putIntentParameter, addIntentParameter, deleteIntentParameter, fetchEntity, postPattern, postCorpus, predict, getPhrase, putPhrase, deletePhrase, postPhrase, getPattern} from 'actions/intent'

import {fetchEntityList, certainEntity, updateEntity, deleteEntity, addEntity} from 'actions/entity'

import {PatternList, PhraseList, EntityParameters, IntentList, IntentDesc, EntityTable, ActionsList,EditEntity} from "components/index";

let agentName = '';


@connect((state, dispatch) => ({
    config: state.config,
    intentResult: state.intentResult,
    entityResult: state.entityResult,
    entitySlideResult: state.entitySlideResult
}))

export default class intentList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            originEntity: [],
            value: '',
            intentId: '',
            name: '',
            zhName: '',
            modelPath: '',
            entityParam: [],
            phraseArray: [],
            pattenListKey: 0,
            type: 'positive',
            positivePatterns: [],
            negativePatterns:[],
            intentOrEntity: 'intent',
            certainEntity: {},
            entityAddVisible: false,
            intentMode: '',
            showMenu: false,
        }
    }

    componentWillMount() {
        agentName = this.props.location.query.agent;
        this.props.dispatch(fetchintent('?agent=' + agentName, data => {
            if (data.length) {
                this.initData(this.props.intentResult.data.children[0])
            }
        }, error => {
            console.log(error)
        }));

        this.props.dispatch(fetchEntityList('?agent=' + agentName, data => {
            // console.log(data)
        }, error => {
            console.log(error)
        }))
    }

    getIntent = (item) => {
        this.setState({
            intentOrEntity: 'intent'
        });
        this.initData(item)
    }

    getEntity = (item) => {
        this.setState({
            intentOrEntity: 'entity'
        });
        this.initEntity(item)
    }

    initData = (obj) => {
        this.initState(obj);

        this.initEntityParam(obj.intentId, obj.mode);

        this.initPhrase(obj.intentId);

        this.initPattern(obj.intentId);
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
        this.props.dispatch(fetchEntity('?agent=' + agentName + '&intentId=' + intentId, data => {
            for (let i = 0; i < data.length; i++) {
                data[i].valuesF = [...data[i].values]
                for (let j = 0; j < data[i].valuesF.length; j++) {
                    let reg = /[\[\]]/g
                    let labelReg = /\/L[0-9]/g
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
        this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    };

    initPattern = (intentId) => {
        this.props.dispatch(getPattern('?agent=' + agentName + '&intentId=' + intentId + '&type=positive',
            data => {
                this.setState({
                    positivePatterns: data
                })
            },error => {
                console.log(error)
            }));
        this.props.dispatch(getPattern('?agent=' + agentName + '&intentId=' + intentId + '&type=negative',
            data => {
                this.setState({
                    negativePatterns: data
                })
            },error => {
                console.log(error)
            }))
    };

    initEntity = (obj) => {
        this.props.dispatch(certainEntity('?agent=' + agentName + '&entityName=' + obj.key, data => {
            this.setState({
                certainEntity: {...data}
            })
        }, error => {
            console.log(error)
        }))
    };

    getPhrase = () => {
        this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + this.state.intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    }

    getPatternList = (prop, type) => {
        this.props.dispatch(getPattern('?agent=' + prop.agentName + '&intentId=' + prop.intentId + '&type=' + type,
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
    }

    reloadPatterns = () => {
        this.getPatternList({agentName: agentName, intentId: this.state.intentId}, 'positive')
        this.getPatternList({agentName: agentName, intentId: this.state.intentId}, 'negative')
    }

    showMoreValues = (i) => {
        this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF]
        this.setState({
            entityParam: this.state.entityParam
        })
    }

    showLessValues = (i) => {
        this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF.slice(0, 10)]
        this.setState({
            entityParam: this.state.entityParam
        })
    }

    updateEntity = (obj) => {
        this.props.dispatch(updateEntity({
            agent: agentName,
            entity: obj
        }, data => {
            this.initEntity({key:obj.name})
        }, error => {
            console.log(error)
        }))
    };

    deleteEntity = (obj) => {
        this.props.dispatch(deleteEntity('?agent=' + agentName + '&entityId=' + obj.entityId, data => {
            this.props.dispatch(fetchEntityList('?agent=' + agentName, data => {
                this.initEntity({key:data[0]})
            }, error => {
                console.log(error)
            }))
        }))
    }

    showAddEntity = () => {
        this.setState({
            entityAddVisible: true
        })
    }

    hideAddModal = () => {
        this.setState({
            entityAddVisible: false
        })
    };

    addintent = (obj) => {
        this.props.dispatch(postIntent({agent: agentName,...obj},data => {
            this.props.dispatch(fetchintent('?agent=' + agentName, data => {
                if (data.length) {
                }
            }, error => {
                console.log(error)
            }))
        }, error => {
            console.log(error)
        }))
    };

    deleteIntent = (intentId) => {
        this.props.dispatch(deleteIntent('?agent=' + agentName + '&intentId=' + intentId,data => {
            this.props.dispatch(fetchintent('?agent=' + agentName, data => {
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

    editIntent = (param, obj) => {
        this.props.dispatch(putIntent({
            ...param,
            agent: agentName
        }, data => {
            this.props.dispatch(fetchintent('?agent=' + agentName, data => {
                this.initState(obj)
            }, error => {
                console.log(error)
            }));


        }))
    };

    editIntentParameter = (param,obj) => {
        this.props.dispatch(putIntentParameter({
            ...param,
            agent: agentName
        }, data => {
            this.initEntityParam(obj.intentId,obj.mode)
            // this.props.dispatch(fetchintent('?agent=' + agentName, data => {
            //     if (data.length) {
            //         this.initData(this.props.intentResult.data.children[0])
            //     }
            // }, error => {
            //     console.log(error)
            // }))
        }, error => {}))
    };

    addIntentParameter = (param,obj) => {
        this.props.dispatch(addIntentParameter({
            ...param,
            agent: agentName
        }, data => {
            this.initEntityParam(obj.intentId, obj.mode)
            // this.props.dispatch(fetchintent('?agent=' + agentName, data => {
            //     if (data.length) {
            //         this.initData(this.props.intentResult.data.children[0])
            //     }
            // }, error => {
            //     console.log(error)
            // }))
        }, error => {}))
    };

    deleteIntentParameter = (param, obj) => {
        this.props.dispatch(deleteIntentParameter({
            ...param,
            agent: agentName
        }, data => {
            this.initEntityParam(obj.intentId, obj.mode);
            this.initPattern(obj.intentId);
        }, error => {}))
    };

    handleEntitySubmit = (obj) => {
        this.props.dispatch(addEntity(
            {
                agent: agentName,
                ...obj
            }, data => {
                this.hideAddModal()
                this.props.dispatch(fetchEntityList('?agent=' + agentName, data => {
                }, error => {
                    console.log(error)
                }))
            }, error => {
                console.log(error)
            }
        ))
    };

    showMenu = (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.setState({
            showMenu: !this.state.showMenu
        })
    };

    render() {

        const agentName = this.props.location.query.agent;
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
            }
        };

        return <Spin spinning={intentResult.loading}>
            <div className='intent-inner-container'>
                <Link className='bread-cruft' to={'/selectService'}>
                    <Icon style={{fontWeight:'bold'}} type='left'></Icon>应用选择
                    <Icon onClick={this.showMenu} className="menu-fold" type="menu-fold" />
                </Link>
                <div style={style.innerBox} className='intentContainer'>
                    <IntentList originEntity={[intentResult.data]} intentId={this.state.intentId} agent={agentName} getIntent={this.getIntent} entityList={[entitySlideResult]} getEntity={this.getEntity} addintent={this.addintent} deleteIntent={this.deleteIntent} handleEntitySubmit={this.handleEntitySubmit} showMenu={this.state.showMenu}/>
                    {
                        this.state.intentOrEntity == 'intent' ? 
                        <div style={{height: '100%', overflow: 'auto'}}>
                            {!intentResult.loading ? <div className="container" style={style.body}>
                                <IntentDesc name={this.state.name} zhName={this.state.zhName}
                                            modelPath={this.state.modelPath} mode={this.state.intentMode} intentId={this.state.intentId} editIntent={this.editIntent}/>
                                <EntityParameters entityList={entitySlideResult.children} entityParam={this.state.entityParam} agent={agentName} intentId={this.state.intentId} name={this.state.name} zhName={this.state.zhName} modelPath={this.state.modelPath} mode={this.props.mode} showLessValues={this.showLessValues} showMoreValues={this.showMoreValues} addIntentParameter={this.addIntentParameter} deleteIntentParameter={this.deleteIntentParameter} putIntentParameter={this.editIntentParameter}/>
                                <PatternList key={this.state.pattenListKey} agentName={agentName} intent={this.state.name} intentId={this.state.intentId}
                                             corpusType={this.state.type} updatePhrase={this.getPhrase} phraseArray={this.state.phraseArray} entityParam={this.state.entityParam} positivePatterns={this.state.positivePatterns} negativePatterns={this.state.negativePatterns} getPatternList={this.getPatternList}/>

                                <PhraseList intent={this.state.name} agent={agentName} intentId={this.state.intentId} phraseArray={this.state.phraseArray}
                                            updatePhraseArray={this.getPhrase}  reloadPatterns={this.reloadPatterns}/>

                                <ActionsList agentName={agentName} intentId={this.state.intentId} intentMode={this.state.intentMode}/>
                            </div> : ''}
                        </div> : 
                        <div style={{width: '80%'}}>
                            <div style={{height: '55px', lineHeight: '50px'}}>
                                <span style={{fontSize: '20px'}}>实体</span>
                                <span className='add-new-button' onClick={this.showAddEntity}>新增</span>
                            </div>
                            <EntityTable data={this.state.certainEntity} addItem={this.updateEntity} deleteEntity={this.deleteEntity} delItem={this.updateEntity}/>
                            <EditEntity entityAddVisible={this.state.entityAddVisible} hideAddEntity={this.hideAddModal} handleEntitySubmit={this.handleEntitySubmit}/>
                        </div>
                    }
                </div>
            </div>
        </Spin>
    }
}
