import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Spin, Icon, Form, Row, Col, Modal, Input, Button} from 'antd'
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
    postPhrase,
    getPattern
} from 'actions/intend'

import {fetchEntityList, certainEntity, updateEntity, deleteEntity, addEntity} from 'actions/entity'

import {PatternList, PhraseList, EntityParameters, IntentList, IntentDesc, EntityTable} from "components/index";

let agentName = '';

const FormItem = Form.Item

@connect((state, dispatch) => ({
    config: state.config,
    intendResult: state.intendResult,
    entityResult: state.entityResult,
    entitySlideResult: state.entitySlideResult
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
            type: 'positive',
            positivePatterns: [],
            negativePatterns:[],
            intentOrEntity: 'intent',
            certainEntity: {},
            entityAddVisible: false
        }
    }

    componentWillMount() {
        agentName = this.props.location.query.agent;
        this.props.dispatch(fetchIntend('?agent=' + agentName, data => {
            if (data.length) {
                this.setState({
                    originEfetchEntityListntity: [...data]
                })
                this.initData(data[0])
            }
        }, error => {
        }))

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
                    data[i].valuesF[j] = data[i].valuesF[j].replace(reg, '').replace(labelReg, '').replace(' ','')
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
        this.props.dispatch(getPattern('?agent=' + agentName + '&intentId=' + obj.intentId + '&type=positive',
                data => {
                    this.setState({
                        positivePatterns: data
                    })
        },error => {
            console.log(error)
        }))
        this.props.dispatch(getPattern('?agent=' + agentName + '&intentId=' + obj.intentId + '&type=negative',
            data => {
                this.setState({
                    negativePatterns: data
                })
            },error => {
                console.log(error)
            }))
    }

    initEntity = (obj) => {
        this.props.dispatch(certainEntity('?agent=' + agentName + '&entityName=' + obj.key, data => {
            this.setState({
                certainEntity: {...data}
            })
        }, error => {
            console.log(error)
        }))
    }

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
        // this.setState({pattenListKey: this.state.pattenListKey + 1})
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
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(addEntity(
                    {
                        agent: agentName,
                        entity: {
                            name: values.entityName,
                            items: [values.entityItems.replace(/，/g, ',')]
                        }
                    }, data => {
                        this.hideAddModal()
                        this.props.dispatch(fetchEntityList('?agent=' + agentName, data => {
                            // console.log(data)
                        }, error => {
                            console.log(error)
                        }))
                    }, error => {

                    }
                ))
            }
        });
    }

    render() {

        const {getFieldDecorator} = this.props.form

        const agentName = this.props.location.query.agent;
        const {intendResult, entitySlideResult} = this.props;

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

        return <Spin spinning={intendResult.loading}>
            <div style={style.innerContainer}>
                <Link className='bread-cruft' style={style.headerStyle} to={'/selectService'}><Icon style={{fontWeight:'bold'}} type='left'></Icon>应用选择</Link>
                <div style={style.innerBox} className='intentContainer'>
                    <IntentList originEntity={[intendResult.data]} intentId={this.state.intentId}
                                getIntent={this.getIntent} entityList={[entitySlideResult]} getEntity={this.getEntity}/>

                    {
                        this.state.intentOrEntity == 'intent' ? <div style={{height: '100%', overflow: 'auto'}}>
                            {!intendResult.loading ? <div className="container" style={style.body}>
                                <IntentDesc name={this.state.name} zhName={this.state.zhName}
                                            modelPath={this.state.modelPath}/>
                                <EntityParameters entityParam={this.state.entityParam} showLessValues={this.showLessValues}
                                                  showMoreValues={this.showMoreValues}/>
                                <PatternList key={this.state.pattenListKey} agentName={agentName} intent={this.state.name} intentId={this.state.intentId}
                                             corpusType={this.state.type} updatePhrase={this.getPhrase} phraseArray={this.state.phraseArray} entityParam={this.state.entityParam} positivePatterns={this.state.positivePatterns} negativePatterns={this.state.negativePatterns} getPatternList={this.getPatternList}/>

                                <PhraseList intent={this.state.name} agent={agentName} intentId={this.state.intentId} phraseArray={this.state.phraseArray}
                                            updatePhraseArray={this.getPhrase}  reloadPatterns={this.reloadPatterns}/>
                            </div> : ''}
                        </div> : <div>
                            <div>
                                <span>实体</span>
                                <span onClick={this.showAddEntity}>新增</span>
                            </div>
                            <EntityTable data={this.state.certainEntity} addItem={this.updateEntity} deleteEntity={this.deleteEntity} delItem={this.updateEntity}/>
                            <Modal
                                title="新增"
                                visible={this.state.entityAddVisible}
                                centered
                                destroyOnClose="true"
                                footer={null}
                                onCancel={this.hideAddModal}
                                bodyStyle={{padding:0}}
                            >
                                <Form onSubmit={this.handleSubmit}>
                                    <FormItem className="modalFormItem">
                                        {getFieldDecorator('entityName', {
                                            rules: [
                                                {required: true, message: '请输入实体名字'},
                                                {
                                                    pattern: /^[0-9a-zA-Z\u4E00-\u9FFF]+$/,
                                                    message: '不能有非法字符串'
                                                }
                                            ]
                                        })(<Input
                                            placeholder="请输入实体名字"
                                            type="text"
                                        />)}
                                    </FormItem>
                                    <FormItem className="modalFormItem">
                                        {getFieldDecorator('entityItems', {
                                            rules: [
                                                {
                                                    pattern: /^[0-9a-zA-Z\u4E00-\u9FFF,]+$/,
                                                    message: '不能有非法字符串'
                                                }
                                            ]
                                        })(<Input
                                            placeholder="请输入实体的值"
                                            type="text"
                                        />)}
                                    </FormItem>
                                    <FormItem>
                                        <div style={style.modalFoot}>
                                            <Button onClick={this.hideAddModal}>Cancel</Button>
                                            <Button style={style.modalFootBtn} type="primary" htmlType="submit">
                                                OK
                                            </Button>
                                        </div>
                                    </FormItem>
                                </Form>
                            </Modal>
                        </div>
                    }
                </div>
            </div>
        </Spin>
    }
}
