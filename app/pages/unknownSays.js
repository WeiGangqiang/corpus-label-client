import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form, Row, Col} from 'antd'
import {isArrayDomain} from 'utils/util'
import {
    fetchintent,
    fetchEntity,
    postPattern,
    postCorpus,
    predict,
    getPhrase,
    putPhrase,
    deletePhrase,
    postPhrase,
    getPattern
} from 'actions/intent'

import {unknownList} from 'actions/unknown'

import {fetchEntityList, certainEntity, updateEntity, deleteEntity, addEntity} from 'actions/entity'

import {UnknownPatternList, EntityParameters, PatternList, PhraseList, IntentList, IntentDesc} from "components/index";

let agent = '';

@connect((state, dispatch) => ({
    config: state.config,
    intentResult: state.intentResult,
    entityResult: state.entityResult,
    unknownResult: state.unknownResult,
    entitySlideResult: state.entitySlideResult
}))

@Form.create({
    onFieldsChange(props, items) {
    },
})
export default class unknownSays extends Component {
    constructor(props) {
        super(props)
        this.state = {
            agent: '',
            intent: '',
            intentId: '',
            intentOrEntity: 'intent',
            entityParam: [],
            phraseArray: [],
            certainEntity: {}
        };
    }

    componentWillMount() {
        agent = this.props.location.query.agent;
        this.setState({
            agent: agent
        })
        this.props.dispatch(fetchintent('?agent=' + agent, data => {
            if (data.length) {
                this.initData(agent, data[0])
            }
        }, error => {
            console.log(error)
        }));
        this.props.dispatch(fetchEntityList('?agent=' + agent, data => {
            // console.log(data)
        }, error => {
            console.log(error)
        }));

        this.props.dispatch(unknownList('?agent=' + agent, data => {
            // console.log(data)
        }, error => {
            console.log(error)
        }));

    }

    initData (agent, obj) {
        this.setState({
            intent: obj.name,
            intentId: obj.intentId
        })
        this.props.dispatch(fetchEntity('?agent=' + agent + '&intentId=' + obj.intentId, data => {
            for (let i = 0; i < data.length; i++) {
                data[i].valuesF = [...data[i].values]
                for (let j = 0; j < data[i].valuesF.length; j++) {
                    let reg = /[\[\]]/g
                    let labelReg = /\/L[0-9]/g
                    data[i].valuesF[j] = data[i].valuesF[j].replace(reg, '').replace(labelReg, '').replace(' ','')
                }
                data[i].valuesShow = [...data[i].valuesF.slice(0, 10)]
            }
            this.setState({
                entityParam: [...data]
            })
        }, error => {
            console.log(error)
        }))
        this.props.dispatch(getPhrase('?agent=' + agent + '&intentId=' + obj.intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    }

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

    getIntent = (item) => {
        this.setState({
            intentOrEntity: 'intent'
        });
        this.initData(agent, item)
    };

    getEntity = (item) => {
        this.setState({
            intentOrEntity: 'entity'
        });
        this.initEntity(item)
    };

    initEntity = (obj) => {
        this.props.dispatch(certainEntity('?agent=' + agent + '&entityName=' + obj.key, data => {
            this.setState({
                certainEntity: {...data}
            })
        }, error => {
            console.log(error)
        }))
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
          this.props.dispatch(unknownList('?agent=' + agent, data => {
            this.setState({
              unknownResult: [...data]
            })
          }, error => {
            console.log(error)
          }));
    }

    saveCorpus = (obj) => {
        console.log('enter saveCorpus')
        this.props.dispatch(postCorpus(obj, data => {
            // this.props.dispatch(unknownList('?agent=' + agent, data => {
            // }, error => {
            //     console.log(error)
            // }));
        }))
    }

    render() {
        const {unknownResult, intentResult, entitySlideResult} = this.props
        const style = {
            innerContainer: {
                width: '100%',
                height: '100%',
                paddingTop: '50px',
            },
            innerBox: {
                height: '100%'
            },
            headerStyle:{
                background: '#0099CC',
            },
            body: {
                width: '80%'
            }
        }                                                                                                                                                                  ;
        return (
            <Spin spinning={intentResult.loading}>
                <div style={style.innerContainer}>
                    <Link className='bread-cruft' to={'/selectService'}>
                        <Icon style={{fontWeight:'bold'}} type='left'></Icon>应用选择

                    </Link>
                    <div style={style.innerBox} className='intentContainer'>
                        <IntentList
                            originEntity={[intentResult.data]}
                            intentId={this.state.intentId}
                            getIntent={this.getIntent}
                            entityList={[entitySlideResult]}
                            getEntity={this.getEntity}
                        />

                        <div style={{height: '100%', overflow: 'auto'}}>
                            <div className="container" style={style.body}>
                                <EntityParameters
                                    entityParam={this.state.entityParam}
                                    showLessValues={this.showLessValues}
                                    showMoreValues={this.showMoreValues}
                                />
                                <UnknownPatternList
                                    agentName={this.state.agent}
                                    intent={this.state.intent}
                                    intentId={this.state.intentId}
                                    phraseArray={this.state.phraseArray}
                                    entityParam={this.state.entityParam}
                                    patterns={unknownResult.data}
                                    updatePhrase={this.getPhrase}
                                    getPatternList={this.getPatternList}
                                    saveCorpus={this.saveCorpus}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>

        )
    }
}
