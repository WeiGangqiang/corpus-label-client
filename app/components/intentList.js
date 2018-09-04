import React, {Component} from 'react';

import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

export class IntentList extends Component {
    constructor(props) {
        super(props);
        this.state={
            expandedKeys: [],
            beforeKey: '',
            top: 0,
            left: 0,
            showUl: 'none'
        }
    }

    selectNode =(selectKey,e) => {
        if(e.selectedNodes.length){
            if(e.selectedNodes[0].props.dataRef.intentId){
                this.props.getIntent(e.selectedNodes[0].props.dataRef)
            }
        }else{

        }
    };

    clickNode = (e, node) => {
        console.log(e,node.props)
    };

    rightClickNode =({event, node}) => {
        // console.log(event.clientX, event.clientY)
        this.setState({
            showUl: 'block',
            top: event.pageY + 14,
            left: event.pageX
        })
        // console.log(event.pageX, event.pageY)
    };

    selectNodeEntity = (selectKey, e) => {
        if(e.selectedNodes.length){
            if(e.selectedNodes[0].props.dataRef.entityId){
                this.props.getEntity(e.selectedNodes[0].props.dataRef)
            }
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
            intentBox: {
                height: '100%',
                float: 'left',
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
            },
            positionDiv:{
                position: 'fixed',
                background: 'transparent',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'none',
                zIndex: 2
            },
            positionUl:{
                position: 'fixed',
                background: '#fff',
                width: '100px',
                height: '80px',
                boxShadow: '0px 0px 13px 3px #ccc',
                borderRadius: '5px'
            },
            positionLi:{
                display: 'block',
                lineHeight: '40px',
                height: '40px',
                width: '100%',
                textAlign: 'center',
                cursor: 'pointer'
            }
        }

        return (
            <div className='intentSlide' style={style.intentBox}>
                <div style={style.corpusBox}>
                    <div style={style.headerTitle}>操作</div>
                    <Tree
                        autoExpandParent={true}
                        onSelect={this.selectNode}
                        onClick={this.clickNode}
                        onRightClick={this.rightClickNode}
                        // expandedKeys={this.state.expandedKeys}
                    >
                        {this.renderTreeNodes(this.props.originEntity)}
                    </Tree>
                    <Tree
                        autoExpandParent={true}
                        onSelect={this.selectNodeEntity}
                    >
                        {this.renderTreeNodes(this.props.entityList)}
                    </Tree>
                </div>
                <div style={{...style.positionDiv, display: this.state.showUl}}>
                    <ul style={{...style.positionUl, top:this.state.top, left: this.state.left}}>
                        <li className="hoverLi" style={style.positionLi}>增加子意图</li>
                        <li className="hoverLi" style={style.positionLi}>删除此意图</li>
                    </ul>
                </div>
            </div>
        )
    }
}
