import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Menu, Icon, Button} from 'antd';
import {fetchEntity, getPhrase, putPhrase, postPhrase} from 'actions/intend'

const SubMenu = Menu.SubMenu;

@connect((state, dispatch) => ({}))
export class ColorDownList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phraseArray: [],
            entityParam: [],
            current: ''
        }
    }

    componentWillMount() {
        this.props.dispatch(fetchEntity('?agent=' + this.props.agent + '&intentId=' + this.props.intentId, data => {
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
        this.props.dispatch(getPhrase('?agent=' + this.props.agent + '&intentId=' + this.props.intentId
            , data => {
                this.setState({
                    phraseArray: [...data]
                })
            }, error => {
                console.log(error)
            }))
    }

    hideDownlist() {
        this.props.hideDownlist()
    }

    stop = (e) => {
        e.stopPropagation()
    }

    getButtonType = (e) => {
      return e.key.split('###')[1]
    }

    getLabelId = (e)=> {
      return e.key.split('###')[0]
    }

    updatePhraseLabel = (phraseId) => {
      let item = this.state.phraseArray.find(item => item.phraseId === phraseId)
      let that = this
      this.props.dispatch(putPhrase({
          similars: [...item.similars, this.props.sentence],
          phraseId: item.phraseId,
          intentId: item.intentId,
          intent: this.props.intent,
          agent: this.props.agent
      }, data => {
        that.props.entityOrPhrase({id:phraseId, type: 'phrase'})
      }))
    }

    addPhrase = () => {
      let that = this
      this.props.dispatch(postPhrase({
        similars: [this.props.sentence],
        intentId: this.props.intentId,
        intent: this.props.intent,
        agent: this.props.agent
      }, data => {
        that.props.entityOrPhrase({ id: data.id, type: 'phrase' })
      }))
    }

    addEntityLabel = (entityId) => {
      this.props.entityOrPhrase({ id: entityId, type: 'entity' })
    }

    entityOrPhrase = (e) => {
      if(this.getButtonType(e) == 'phrase'){
        this.updatePhraseLabel(this.getLabelId(e))

      }else if (this.getButtonType(e) == 'addNew'){
        this.addPhrase()
      }else if (this.getButtonType(e) == 'entity'){
        this.addEntityLabel(this.getLabelId(e))
      }
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
        borderBottom: '1px solid #0099CC',
      }
      this.state.entityParam.forEach(entity => {
        subMenus.push(<Menu.Item style={menuStyle} key={entity.name + '###entity'}>{that.getEntityDisplay(entity)}</Menu.Item>)
      })

      this.state.phraseArray.forEach(phrase => {
        subMenus.push(<Menu.Item style={menuStyle}  key={phrase.phraseId + '###phrase'}>{that.getPhraseDisPlay(phrase)}</Menu.Item>)
      })

      subMenus.push(<Menu.Item key={'453543###addNew'}>新增</Menu.Item>)
      return subMenus
    }

    removelabel = (e) => {
      this.props.removeLabel(this.props.labelIndex)
      this.props.hideDownlist()
    }

    findLabelDesc = ()=> {
      let label = this.props.label
      if (label.type == 'entity') {
        let entity = this.state.entityParam.find((value)=> {
          return value.id = label.id
        })
        return !entity ? '': this.getEntityDisplay(entity)
      } else {
        let phrase = this.state.phraseArray.find((value) => {
          return value.id = label.id
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
          background: '#DDDDDD',
          borderBottom: '1px solid #0099CC',
          paddingLeft:'15px',
          paddingTop:'3px'
        },
        detail: {
          float: 'left',
          marginTop: '5px'
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
                background: '#DDDDDD',
            },
            innerLi: {
                display: 'inline-block'
            },
            menu: {
              background: '#DDDDDD',
              float:'left'
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