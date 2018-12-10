import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link, hashHistory} from 'react-router'
import {Spin, Icon, Form, Row, Col} from 'antd'
import {isArrayDomain} from 'utils/util'
import {fetchintent, postIntent, deleteIntent, putIntent, putIntentParameter, addIntentParameter, deleteIntentParameter, fetchEntity, postPattern, postCorpus, predict, getPhrase, putPhrase, deletePhrase, postPhrase, getPattern} from 'actions/intent'

import {fetchEntityList, certainEntity, updateEntity, deleteEntity, addEntity, entityReference} from 'actions/entity'

import {setRouteParam} from "actions/routeParam";

import {PatternList, PhraseList, EntityParameters, IntentList, IntentTitle, IntentDesc, EntityTable, ActionsList,EditEntity} from "components/index";
import {EntityDesc} from 'components/entityDesc'
import {Logout} from 'components/logout'
import {ChatPage} from 'components/chatpage/chatpage'

let agentName = '';


@connect((state, dispatch) => ({
    config: state.config,
    intentResult: state.intentResult,
    entityResult: state.entityResult,
    entitySlideResult: state.entitySlideResult
}))

export default class CorpusLabel extends Component {
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
            entityRefrence: [],
            entityAddVisible: false,
            intentMode: '',
            showMenu: false,
        }
    }

    componentWillMount() {
        agentName = sessionStorage.getItem('agent');
        console.log(agentName)
    }

    componentDidMount() {
        this.props.dispatch(fetchintent('?agent=' + agentName, data => {
            if (data.length) {
                this.props.dispatch(setRouteParam(this.props.intentResult.data.children[0]))
                // hashHistory.push({
                //     pathname:'/corpusLabel/intent/' + this.props.intentResult.data.children[0].name,
                //     query:this.props.intentResult.data.children[0],
                // })
                hashHistory.push({
                    pathname:'/corpusLabel/intent/' + this.props.intentResult.data.children[0].name
                })
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
            this.componentDidMount()
        }, error => {
            console.log(error)
        }))
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
        const {intentResult, entitySlideResult, children} = this.props;

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
                <div className='bread-cruft'>
                    <Link to={'/selectService'}>
                        <Icon style={{fontWeight:'bold'}} type='left'></Icon>应用选择
                    </Link>
                    <Icon onClick={this.showMenu} className="menu-fold" type="menu-fold" />
                    <Logout/>
                </div>
                <div style={{position:'fixed', zIndex: 500}}>
                    <ChatPage agentName={agentName}/>
                </div>
                <div style={style.innerBox} className='intentContainer'>

                    <IntentList
                        agent={agentName}
                        entityList={[entitySlideResult]}
                        originEntity={[intentResult.data]}
                        showMenu={this.state.showMenu}
                        intentId={this.state.intentId}
                        addintent={this.addintent}
                        deleteIntent={this.deleteIntent}
                        handleEntitySubmit={this.handleEntitySubmit}
                    />
                    <div style={{height:'100%'}} className={'children'}>
                        {children}
                    </div>
                </div>
            </div>
        </Spin>
    }
}
