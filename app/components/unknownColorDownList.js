import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Menu, Icon, Button} from 'antd';
import {fetchEntity, getPhrase, putPhrase, postPhrase} from 'actions/intend'

const SubMenu = Menu.SubMenu;

@connect((state, dispatch) => ({}))
export class UnknownColorDownList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: ''
        }
    }

    hideDownlist() {
        this.props.hideDownlist()
    }

    stop = (e) => {
        e.stopPropagation()
    }

    getLabelId = (e)=> {
        return e.key.split('###')[0]
    }

    getLabel = (e) => {
        return this.props.entityParam.find(item => item.name == e).label
    }

    addEntityLabel = (entityId, label) => {
        this.props.entityOrPhrase({ id: entityId, type: 'entity', label: label })
    }

    entityOrPhrase = (e) => {
        const label = this.getLabel(this.getLabelId(e))
        this.addEntityLabel(this.getLabelId(e), label)
        this.props.hideDownlist()
    }

    getEntityDisplay = (entity) => {
        return '槽位：' + entity.name
    }

    getPhraseDisPlay = (phrase) => {
        return '近义词：' + phrase.similars.slice(0,2).join(',')
    }

    getSubMenu = () =>{
        let subMenus = []
        let that = this
        let menuStyle = {
            borderTop: '1px solid #dadada',
        }
        let noMargin = {
            margin: 0
        }

        this.props.entityParam.forEach(entity => {
            if(that.props.hasLabel && that.props.label.type == 'entity'){
                if(entity.name == that.props.label.id){
                    return
                }
            }
            subMenus.push(<Menu.Item className="corpusItem" style={{...noMargin}} key={entity.name + '###entity'}>{that.getEntityDisplay(entity)}</Menu.Item>)
        })
        return subMenus
    }

    removelabel = (e) => {
        this.props.removeLabel(this.props.labelIndex)
        this.props.hideDownlist()
    }

    findLabelDesc = ()=> {
        let label = this.props.label
        if (label.type == 'entity') {
            let entity = this.props.entityParam.find((value)=> {
                return value.name == label.id
            })
            return !entity ? '': this.getEntityDisplay(entity)
        } else {
            let phrase = this.props.phraseArray.find((value) => {
                return value.phraseId == label.id
            })
            return !phrase ? '': this.getPhraseDisPlay(phrase)
        }
    }

    getCurLabelAction = () =>{
        if (!this.props.hasLabel){
            return ''
        }

        const style = {
            labelAction: {
                height: '40px',
                background: '#eee',
                borderBottom: '1px solid #dadada',
                paddingLeft:'15px',
                paddingTop:'3px',
                lineHeight: '32px'
            },
            detail: {
                float: 'left',
                margin: '0px'
            },
            button: {
                float: 'right'
            }
        }

        return (<div style={style.labelAction} > <p style={style.detail}>{this.findLabelDesc()} </p>  <Button style={style.button} onClick={this.removelabel} icon="close"></Button></div>)
    }

    render() {
        const style = {
            colorContainer: {
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 10
            },
            innerBox: {
                position: 'absolute',
                background: '#eee',
                boxShadow: '0px 0px 5px 0px #ccc'
            },
            innerLi: {
                display: 'inline-block'
            },
            menu: {
                background: '#eee',
                float:'left',
                width:'100%'
            }
        }

        return (
            <div style={style.colorContainer} onClick={this.hideDownlist.bind(this)}>
                <div style={{...style.innerBox, left: this.props.left - 42 + 'px', top: this.props.top -(-10) + 'px'}}
                     onClick={this.stop}>
                    {this.getCurLabelAction()}
                    <Menu style= {style.menu} onClick={this.entityOrPhrase}
                          selectedKeys={[this.state.current]}>
                        {this.getSubMenu()}
                    </Menu>
                </div>
            </div>
        )
    }
}