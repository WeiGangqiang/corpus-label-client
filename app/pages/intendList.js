import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form, Row, Col} from 'antd'
import {isArrayDomain} from 'utils/util'
import {
    fetchIntend,
    fetchEntity,
    postPattern,
    postCorpus,
    predict,
    getPhrase,
    putPhrase,
    deletePhrase,
    postPhrase
} from 'actions/intend'

import {PatternList, PhraseList, EntityParameters, IntentList, IntentDesc} from "components/index";

const agentName = sessionStorage.getItem('agentName');

@connect((state, dispatch) => ({
    config: state.config,
    intendResult: state.intendResult,
    entityResult: state.entityResult,
}))

@Form.create({
    onFieldsChange(props, items) {
    },
})
export default class intendList extends Component {
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
            type: 'positive'
        };
        this.initData = this.initData.bind(this);
        this.getIntent = this.getIntent.bind(this)
        this.getPhrase = this.getPhrase.bind(this)
        this.showMoreValues = this.showMoreValues.bind(this)
        this.showLessValues = this.showLessValues.bind(this)
    }

    componentWillMount() {
        const agentName = sessionStorage.getItem('agentName');
        this.props.dispatch(fetchIntend('?agent=' + agentName, data => {
            if (data.length) {
                this.setState({
                    originEntity: [...data]
                })
                this.initData(data[0])
            }
        }, error => {
        }))

    }

    componentDidMount() {
    }

    getIntent(item) {
        this.initData(item)
    }

    initData(obj) {
        this.setState({
            name: obj.name,
            zhName: obj.zhName,
            modelPath: obj.modelPath,
            intentId: obj.intentId
        });
        this.props.dispatch(fetchEntity('?agent=' + agentName + '&intentId=' + obj.intentId, data => {
            for (let i = 0; i < data.length; i++) {
                data[i].valuesF = [...data[i].values]
                for (let j = 0; j < data[i].valuesF.length; j++) {
                    let reg = /[\[\]]/g
                    let labelReg = /\/L[0-9]/g
                    data[i].valuesF[j] = data[i].valuesF[j].replace(reg, '').replace(labelReg, '')
                }
                data[i].valuesShow = [...data[i].valuesF.slice(0, 10)]
            }
            this.setState({
                entityParam: [...data]
            })
        }, error => {

        }))
        this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + obj.intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    }

    getPhrase() {
        this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + this.state.intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    }

    reloadPatterns = () => {
        this.setState({pattenListKey: this.state.pattenListKey + 1})
    }

    showMoreValues(i) {
        this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF]
        this.setState({
            entityParam: this.state.entityParam
        })
    }

    showLessValues(i) {
        this.state.entityParam[i].valuesShow = [...this.state.entityParam[i].valuesF.slice(0, 10)]
        this.setState({
            entityParam: this.state.entityParam
        })
    }

    render() {
        const agentName = sessionStorage.getItem('agentName');
        console.log('agent name is ', agentName)
        const {intendResult} = this.props;
        const style = {
            innerContainer: {
                width: '100%',
                height: '100%',
                paddingTop: '55px',
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
        };
        return <Spin spinning={intendResult.loading}>
            <div style={style.innerContainer}>
                <Link className='bread-cruft' style={style.headerStyle} to={'/selectService'}><Icon style={{fontWeight:'bold'}} type='left'></Icon>机器人选择</Link>
                <div style={style.innerBox} className='intentContainer'>
                    <IntentList originEntity={[intendResult.data]} intentId={this.state.intentId}
                                getIntent={this.getIntent}/>
                    <div style={{height: '100%', overflow: 'auto'}}>
                        {!intendResult.loading ? <div className="container" style={style.body}>
                            <IntentDesc name={this.state.name} zhName={this.state.zhName}
                                        modelPath={this.state.modelPath}/>
                            <EntityParameters entityParam={this.state.entityParam} showLessValues={this.showLessValues}
                                              showMoreValues={this.showMoreValues}/>
                            <PatternList key={this.state.pattenListKey} agentName={agentName} intent={this.state.name} intentId={this.state.intentId}
                                         corpusType={this.state.type} updatePhrase={this.getPhrase} phraseArray={this.state.phraseArray}/>

                            <PhraseList intent={this.state.name} agent={agentName} intentId={this.state.intentId} phraseArray={this.state.phraseArray}
                                        updatePhraseArray={this.getPhrase}  reloadPatterns={this.reloadPatterns}/>
                        </div> : ''}
                    </div>
                </div>
            </div>
        </Spin>
    }
}
