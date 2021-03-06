import React, {Component} from 'react';

import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export class IntentList extends Component {
    constructor(props) {
        super(props);
        this.state={
            expandedKeys: [],
            beforeKey: ''
        }
    }

    selectNode =(selectKey,e) => {
        if(e.selectedNodes.length){
            if(e.selectedNodes[0].props.dataRef.intentId){
                this.props.getIntent(e.selectedNodes[0].props.dataRef)
            }
        }else{

        }
    }

    renderTreeNodes = (data) => {
        return data.map((item,index) => {
            if (item.children) {
                return (
                    <TreeNode key={index} title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={index} {...item} />;
        });
    }

    render() {

        const style = {
            corpusBox: {
                background: '#fbfbfb',
                padding: '40px 15px 15px',
                width: '100%',
                height: '100%',
                borderRadius: '15px'
            },
            headerTitle: {
                lineHeight: '40px',
                fontSize: '16px',
                float: 'left',
                marginTop: '-40px',

            },
            flexBox: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-start',
                flexDirection: 'column'
            },
            serveLi:{
                lineHeight: '40px',
                cursor:'pointer'
            }
        }

        console.log(this.props.originEntity)

        return (
            <div className='intentSlide'>
                <div style={{...style.corpusBox, display: this.props.originEntity.length ? 'block' : 'none'}}>
                    <div style={style.headerTitle}>意图列表</div>
                    <Tree
                        autoExpandParent={true}
                        onSelect={this.selectNode}
                        // expandedKeys={this.state.expandedKeys}
                    >
                        {this.renderTreeNodes(this.props.originEntity)}
                    </Tree>
                </div>
                <div style={{
                    ...style.corpusBox,
                    fontSize: '14px',
                    display: this.props.originEntity.length ? 'none' : 'block',
                }}>没有意图
                </div>
            </div>
        )
    }
}
