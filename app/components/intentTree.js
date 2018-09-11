import React, {Component} from 'react';
import { TreeSelect } from 'antd';
import {Form} from "antd/lib/index";
import {connect} from "react-redux";

const TreeNode = TreeSelect.TreeNode;

@connect((state, dispatch) => ({
  config: state.config,
  intentResult: state.intentResult,
  entityResult: state.entityResult,
  entitySlideResult: state.entitySlideResult
}))

export class IntentTree extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      value: undefined
    }
  }

  onSelect = (value, label, extra) => {
    console.log('onSelect, item: ',value);
    if (this.props.onSelect) {
      this.props.onSelect(value)
    }
  }

  getIntentTitle = (intent) => {
    if (intent.zhName) {
      return intent.title + '[' + intent.zhName + ']'
    }
    return intent.title
  }

  inIntentIdNull = (intent) => {
    if (!intent) {
      return true
    }
    return !(intent.intentId)
  }

  renderTreeNodes = (data) => {
    return data.map((item,index) => {
      if (item.children) {
        return (
          <TreeNode value={item.intentId} title={this.getIntentTitle(item)} key={item.key}
                    disabled={this.inIntentIdNull(item)}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={index} {...item} />;
    });
  }

  render() {
    return (
      <TreeSelect
        showSearch
        style={{ width: '100%'}}
        value={this.state.value}
        dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
        placeholder="请选择意图"
        allowClear
        treeDefaultExpandAll={true}
        onSelect={this.onSelect}
      >
        {this.renderTreeNodes(this.props.intentCollections)}
      </TreeSelect>
    );
  }
}

// ReactDOM.render(<Demo />, mountNode);
