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
        <Menu.Item className="corpusItem" style={{margin: '0', height: '40px', alignContent:'center', boarder:'none'}} key={index}>
            <UnknownItem
              content={item.sentence}
              index={index}
              intentId=''
              deleteMe={this.props.onDelete}
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
    console.log('enter onItemSelected')
    if (!items) {
      // console.log('items is null')
      return
    }
    if (index < 0 && index >= items.length) {
      return
    }
    if (this.props.items.length) {
      this.props.items.map((item, index) => {
        this.state.isActive[index] = false
      })
    }
    this.state.isActive[index] = true
    this.state.selectedIndex = index
    if (this.props.onSelect) {
      this.props.onSelect(index)
    }

    this.setState({
      isActive: [...this.state.isActive],
      selectedIndex: this.state.selectedIndex
    })
    // console.log('active status:', this.state.isActive)
  }

  onMenuClick = (event) => {
    console.log('onMenuClick, index:', event)
    if (event && event.key) {
      this.onItemSelected(event.key)
    }
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
        height: '100%',
        border:'none',
        background: 'transparent'
        // backgroundColor: '#f8f8f8'
      }
    }
    return (<div>
      <div className="headerTitle">未识别语料</div>
      <Menu onClick={this.onMenuClick} style= {style.menu}>
        {this.getItemView()}
      </Menu>
    </div>)
  }
}
