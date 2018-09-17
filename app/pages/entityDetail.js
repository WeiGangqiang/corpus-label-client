import React, {Component} from 'react';
import {connect} from 'react-redux';
import {message} from 'antd';
import {certainEntity, entityReference, fetchEntityList, deleteEntity, updateEntity, addEntity} from 'actions/entity'

import {EntityDesc, EntityTable, EditEntity} from "components/index";

let agent = '';

@connect((state, dispatch) => ({
}))

export default class EntityDetail extends Component{
    constructor(props){
        super(props)
        this.state = {
            certainEntity: {},
            entityRefrence: [],
            entityAddVisible: false,
        }
    }

    componentWillMount () {
        agent = sessionStorage.getItem('agent');
        console.log(this.props.location.query);
        const {key, entityId} = this.props.location.query;
        this.initEntity({key,entityId})
    }

    isEgle = (obj1,obj2) => {
        if(obj1.key == obj2.key && obj1.title == obj2.title && obj1.entityId == obj2.entityId  && obj1.valid == obj2.valid){
            return true
        }
        return false
    };

    componentWillReceiveProps(props){
        if(this.isEgle(props.location.query, this.props.location.query)){

        }else{
            const {key, entityId} = props.location.query;
            this.initEntity({key,entityId})
        }
    }

    initEntity = (obj) => {
        if(obj.key!='实体'){
            this.props.dispatch(certainEntity('?agent=' + agent + '&entityName=' + obj.key, data => {
                data.items.push('');
                this.setState({
                    certainEntity: {...data}
                })
            }, error => {
                console.log(error)
            }))
            this.props.dispatch(entityReference('?agent=' + agent + '&entityName=' + obj.key, data => {
                this.setState({
                    entityRefrence: [...data.data]
                })
            }))
        }else{

        }
    };

    showAddEntity = () => {
        this.setState({
            entityAddVisible: true
        })
    };

    hideAddModal = () => {
        this.setState({
            entityAddVisible: false
        })
    };

    deleteEntity = (obj) => {
        if(this.state.entityRefrence.length){
            message.info('该实体有多处引用，不允许删除')
            return
        }
        this.props.dispatch(deleteEntity('?agent=' + agent + '&entityId=' + obj.entityId, data => {
            this.props.dispatch(fetchEntityList('?agent=' + agent, data => {
                this.initEntity({key:data[0].name})
            }, error => {
                console.log(error)
            }))
        }))
    };

    updateEntity = (obj) => {
        this.props.dispatch(updateEntity({
            agent: agent,
            entity: obj
        }, data => {
            this.initEntity({key:obj.name})
            this.props.dispatch(fetchEntityList('?agent=' + agent, data => {
            }, error => {
                console.log(error)
            }))
        }, error => {
            console.log(error)
        }))
    };

    handleEntitySubmit = (obj) => {
        this.props.dispatch(addEntity(
            {
                agent: agent,
                ...obj
            }, data => {
                this.hideAddModal()
                this.props.dispatch(fetchEntityList('?agent=' + agent, data => {
                }, error => {
                    console.log(error)
                }))
            }, error => {
                console.log(error)
            }
        ))
    };

    render() {
        return (
            <div className='entity-container'>
                <div className='entity-container-head'>
                    <span style={{fontSize: '20px',fontWeight: 'bold'}}>实体</span>
                    <span className='add-new-button' onClick={this.showAddEntity}>新增</span>
                </div>

                <EntityDesc
                    entity={this.state.certainEntity}
                    deleteEntity={this.deleteEntity}
                />

                <EntityTable
                    data={this.state.certainEntity}
                    entityRefrence={this.state.entityRefrence}
                    updateEntity={this.updateEntity}
                />

                <EditEntity
                    entityAddVisible={this.state.entityAddVisible}
                    hideAddEntity={this.hideAddModal}
                    handleEntitySubmit={this.handleEntitySubmit}
                />
            </div>
        )
    }
}