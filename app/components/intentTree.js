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
  }

  onSelect = (value, label, extra) => {
    if (!label || !label.props || !label.props.label) {
      return
    }
    if (this.props.onSelect) {
      this.props.onSelect(label.props.label)
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
            <TreeNode value={this.getIntentTitle(item)} title={this.getIntentTitle(item)} key={item.key}
                      label={item.intentId}
                      labelInValue={true}
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
        // value={this.state.value}
        dropdownStyle={{ maxHeight: '600px', overflow: 'auto' }}
        placeholder="请选择意图"
        searchPlaceholder="过滤条件"
        allowClear={true}
        showSearch={true}
        treeDefaultExpandAll={true}
        onSelect={this.onSelect}
      >
        {this.renderTreeNodes(this.props.intentCollections)}
      </TreeSelect>
    );
  }
}

// ReactDOM.render(<Demo />, mountNode);
