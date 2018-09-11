import React, {Component} from 'react';

import { Tree, Modal, message, Radio, Form, Input, Button } from 'antd';

import {EditEntity} from 'components/index'

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@Form.create({
    onFieldsChange(props, items) {
    },
})

export class IntentList extends Component {
    constructor(props) {
        super(props);
        this.state={
            expandedKeys: [],
            beforeKey: '',
            top: 0,
            left: 0,
            showUl: 'none',
            showEntityUl: 'none',
            addIntentVisible: false,
            delIntentVisible: false,
            entityAddVisible: false,
            intentId: '',
            intentName: '',
            modelPath: '',
            defaultModelPath: '',
            mode: ''
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

    rightClickNode =({event, node}) => {
        this.setState({
            showUl: 'block',
            top: event.pageY + 14,
            left: event.pageX,
            intentId: node.props.dataRef && node.props.dataRef.intentId,
            modelPath: node.props.dataRef && node.props.dataRef.modelPath,
            defaultModelPath:  node.props.dataRef && node.props.dataRef.modelPath,
            mode: node.props.dataRef && node.props.dataRef.mode
        })
    };

    rightClickEntity = ({event, node}) => {
        this.setState({
            showEntityUl: 'block',
            top: event.pageY + 14,
            left: event.pageX
        })
    };

    hideUl = () => {
        this.setState({
            showUl: 'none',
            showEntityUl: 'none'
        })
    };

    selectNodeEntity = (selectKey, e) => {
        if(e.selectedNodes.length){
            if(e.selectedNodes[0].props.dataRef.entityId){
                this.props.getEntity(e.selectedNodes[0].props.dataRef)
            }
        }
    };

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
    };

    showAddIntent = (e) => {
        // e.stopPropagation();
        if(this.state.mode != 'local'){
            this.setState({
                addIntentVisible: true
            })
        }else{
            message.info('该目录下不能添加子意图')
        }
    };

    hideAddIntent = () => {
        this.setState({
            addIntentVisible: false
        })
    };

    intentInput = (e) => {
        this.setState({
            modelPath: this.state.defaultModelPath ? this.state.defaultModelPath + '/' + e.target.value : 'users/'+ sessionStorage.getItem('user') + '/' + this.props.agent + '/' + e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.addintent({intent:{
                    "name": values.name,
                    "zhName": values.zhName,
                    "modelPath": values.modelPath,
                    "parameters": []
                }})
                this.hideAddIntent()
            }
        });
    };

    showDelIntent = (e) => {
        // e.stopPropagation()
        if (this.state.intentId.length && this.state.mode != 'local') {
            this.setState({
                delIntentVisible: true
            })
        }else{
            message.info('不允许删除该意图')
        }
    };

    hideDelIntent = () => {
        this.setState({
            delIntentVisible: false
        })
    };

    delIntent = () => {
        this.props.deleteIntent(this.state.intentId)
        this.hideDelIntent()
    };

    showAddEntity = () => {
        this.setState({
            entityAddVisible: true
        })
    };

    hideAddEntity = () => {
        this.setState({
            entityAddVisible: false
        })
    };

    handleEntitySubmit = (obj) => {
        this.props.handleEntitySubmit(obj)
    };

    render() {

        const {getFieldDecorator} = this.props.form;

        const style = {
            corpusBox: {
                background: '#fbfbfb',
                padding: '55px 15px 15px',
                width: '100%',
                height: '100%',
                borderRadius: '15px'
            },
            headerTitle: {
                lineHeight: '55px',
                float: 'left',
                marginTop: '-55px',
                fontSize: '20px',
                fontWeight: 'bold',
                borderBottom: '1px solid #dadada',
                width: '100%'
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
                borderRadius: '5px',
                overflow: 'hidden'
            },
            positionLi:{
                display: 'block',
                lineHeight: '40px',
                height: '40px',
                width: '100%',
                textAlign: 'center',
                cursor: 'pointer'
            },
            modalFoot:{
                height: '52px',
                lineHeight: '32px',
                textAlign: 'right',
                padding: '10px 16px',
                borderTop: '1px solid #e8e8e8'
            },
            modalFootBtn:{
                marginLeft: '8px'
            }
        }

        return (
            <div className={`intentSlide ${this.props.showMenu? 'height-auto': ''}`}>
                <div style={style.corpusBox}>
                    <div style={style.headerTitle}>操作</div>
                    <Tree
                        autoExpandParent={true}
                        defaultExpandAll={true}
                        defaultExpandParent={true}
                        onSelect={this.selectNode}
                        onRightClick={this.rightClickNode}
                        // expandedKeys={this.state.expandedKeys}
                    >
                        {this.renderTreeNodes(this.props.originEntity)}
                    </Tree>
                    <Tree
                        autoExpandParent={true}
                        onSelect={this.selectNodeEntity}
                        onRightClick={this.rightClickEntity}
                    >
                        {this.renderTreeNodes(this.props.entityList)}
                    </Tree>
                </div>
                <div onClick={this.hideUl} style={{...style.positionDiv, display: this.state.showUl=='block'|| this.state.showEntityUl=='block'? 'block': 'none'}}>
                    <ul style={{...style.positionUl, top:this.state.top, left: this.state.left,display: this.state.showUl}}>
                        <li onClick={this.showAddIntent} className="hoverLi" style={style.positionLi}>新增子意图</li>
                        <li onClick={this.showDelIntent} className="hoverLi" style={style.positionLi}>删除此意图</li>
                    </ul>
                    <ul style={{...style.positionUl, top:this.state.top, left: this.state.left,display: this.state.showEntityUl, height: '40px'}}>
                        <li onClick={this.showAddEntity} className="hoverLi" style={style.positionLi}>新增实体</li>
                    </ul>
                </div>
                <Modal
                    title='新增'
                    visible={this.state.addIntentVisible}
                    centered
                    destroyOnClose="true"
                    onCancel={this.hideAddIntent}
                    footer={null}
                    bodyStyle={{padding:0}}
                >
                    {/*<RadioGroup onChange={this.onChange}>*/}
                        {/*{*/}
                            {/*this.props.entityList.length&&this.props.entityList[0].children&&this.props.entityList[0].children.map((item,index) => {*/}
                                {/*return <Radio key={index} value={item.title}>{item.title}</Radio>*/}
                            {/*})*/}
                        {/*}*/}
                    {/*</RadioGroup>*/}

                    <Form onSubmit={this.handleSubmit}>
                        <FormItem className="modalFormItem">
                            {getFieldDecorator('name', {
                                rules: [
                                    {required: true, message: '请输入意图名字'},
                                    {
                                        pattern: /^[0-9a-zA-Z-\u4E00-\u9FFF]+$/,
                                        message: '不能有非法字符串'
                                    }
                                ]
                            })(<Input
                                placeholder="请输入意图名字"
                                type="text"
                                onInput={this.intentInput}
                            />)}
                        </FormItem>
                        <FormItem className="modalFormItem">
                            {getFieldDecorator('zhName', {
                                rules: [
                                    {required: true, message: '请输入意图中文名'}
                                ]
                            })(<Input
                                placeholder="请输入意图中文名"
                                type="text"
                            />)}
                        </FormItem>
                        <FormItem className="modalFormItem">
                            {getFieldDecorator('modelPath', {
                                rules: [
                                    {required: true, message: '请输入modelPath'},
                                ],
                                initialValue: this.state.modelPath
                            })(<Input
                                placeholder="请输入modelPath"
                                type="text"
                                disabled
                            />)}
                        </FormItem>
                        <FormItem>
                            <div style={style.modalFoot}>
                                <Button onClick={this.hideAddIntent}>Cancel</Button>
                                <Button style={style.modalFootBtn} type="primary" htmlType="submit">
                                    OK
                                </Button>
                            </div>
                        </FormItem>
                    </Form>

                </Modal>

                <Modal
                    title='删除提示'
                    visible={this.state.delIntentVisible}
                    centered
                    destroyOnClose="true"
                    onCancel={this.hideDelIntent}
                    onOk={this.delIntent}
                >
                    删除此意图，他的子意图也会被删掉，确定删除吗？
                </Modal>

                <EditEntity entityAddVisible={this.state.entityAddVisible} hideAddEntity={this.hideAddEntity} handleEntitySubmit={this.handleEntitySubmit}/>
            </div>
        )
    }
}
