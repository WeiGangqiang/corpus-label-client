import React, {Component} from 'react'
import {Select} from 'antd'

const Option = Select.Option

import {connect} from 'react-redux'

@connect((state, dispatch) => ({
}))

export class IntentSelect extends Component {
    constructor(props) {
      super(props)

    }

    handleSelect (event) {
      this.props.onChange({target:{
        value:event
      }})
    }

    render(){
      return (
        <Select
          showSearch
          style={{ width: 240 }} 
          value={this.props.value}
          placeholder='请输入意图名'
          defaultActiveFirstOption={true}
          showArrow={true}
          filterOption={(input, option) => {
            return option.props.children.indexOf(input) >= 0}}
          onSelect={this.handleSelect.bind(this)}
          notFoundContent={null}
        >
          { 
          this.props.intentList.map((intent) => {
            return <Option key={intent.title} value={intent.title}>{`${intent.title}(${intent.zhName})`}</Option>
          })}
        </Select>
      );
    }
}