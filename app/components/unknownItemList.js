import React, {Component} from 'react'
import { Card, Menu } from 'antd';
import {UnknownItem} from "components/index";

export class UnknownItemList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: [],
      selectedIndex: 0
    }
  }

  getItemView = () => {
    return this.props.items.length && this.props.items.map((item, index) => {
      return (
        <Menu.Item className="corpusItem" style={{margin: '0'}} key={index}>
            <UnknownItem
              content={item.sentence}
              index={index}
              intentId=''
              deleteMe={this.props.onDelete}
              onSelect={this.onItemSelected}
              pickMe=''
              active={this.state.isActive[index]}
              key={index}
              hideSave={true}
          />
        </Menu.Item>
      )
    })
  }

  onItemSelected = (index) => {
    const {items} = this.props
    console.log('enter list onSelect')
    if (!items) {
      // console.log('items is null')
      return
    }
    if (this.props.items.length) {
      this.props.items.map((item, index) => {
        this.state.isActive[index] = false
      })
    }
    if (index >= 0 && index < items.length) {
      this.state.isActive[index] = true
      if (this.props.onSelect) {
        this.props.onSelect(index)
      }
    }

    this.setState({
      isActive: [...this.state.isActive],
      selectedIndex: index
    })
    // console.log('active status:', this.state.isActive)
  }

  render() {
    const style = {
      pBox: {
        height: '350px',
        border: '1px solid #dadada',
        overflow: 'auto'
      },
      corpusBox: {
        background: '#fbfbfb',
        padding: '0px, 0px',
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        marginBottom: '15px',
        // fontSize: '20px',
        // fontWeight: 'bold',
      },
      menu: {
        float:'left',
        width:'100%',
        boarder:'none'
      }
    }
    return (<div>
      <div className="headerTitle">未识别语料集</div>
      <Menu style= {style.menu}>
        {this.getItemView()}
      </Menu>
    </div>)
  }
}
