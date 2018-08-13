import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Menu, Icon} from 'antd';
import {fetchEntity, getPhrase, putPhrase} from 'actions/intend'

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

    setEntity() {

    }

    setPhrase() {

    }

    addNewPhrase() {

    }

    hideDownlist() {
        this.props.hideDownlist()
    }

    stop = (e) => {
        e.stopPropagation()
    }

    entityOrPhrase = (e) => {

        let item = this.state.phraseArray.find(item => item.phraseId === e.key.split('###')[0])

        if (e.key.split('###')[1] == 'phrase') {
            this.props.dispatch(putPhrase({
                similars: [...item.similars, this.props.sentence],
                phraseId: item.phraseId,
                intentId: item.intentId,
                intent: this.props.intent,
                agent: this.props.agent
            }, data => {
            }))
        }

        this.props.entityOrPhrase({id: e.key.split('###')[0], type: e.key.split('###')[1]})
        this.props.hideDownlist()
    }


    render() {

        const style = {
            colorContainer: {
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
            },
            innerBox: {
                position: 'absolute',
            },
            innerLi: {
                display: 'inline-block'
            }
        }

        return (
            <div style={style.colorContainer} onClick={this.hideDownlist.bind(this)}>
                <div style={{...style.innerBox, left: this.props.left + 'px', top: this.props.top + 'px'}}
                     onClick={this.stop}>
                    <Menu onClick={this.entityOrPhrase}
                          selectedKeys={[this.state.current]}
                          mode="horizontal">
                        <SubMenu title={<span>标注<Icon type="down"/></span>}>
                            {
                                this.state.entityParam.map(entity => {
                                    return <Menu.Item key={entity.name + '###entity'}>{entity.name}</Menu.Item>
                                })
                            }
                        </SubMenu>
                        <SubMenu title={<span>近义词<Icon type="down"/></span>}>
                            {
                                this.state.phraseArray.map(phrase => {
                                    return <Menu.Item key={phrase.phraseId + '###phrase'}>{phrase.phraseId}</Menu.Item>
                                })
                            }
                        </SubMenu>
                    </Menu>
                </div>
            </div>

        )
    }
}