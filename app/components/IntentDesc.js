import React,{ Component } from 'react';
import {Row, Col} from 'antd'

export class IntentDesc extends Component{
    constructor(props) {
        super(props)
    }

    render() {
        const style = {
            col: {
                lineHeight: '40px'
            },
        };

        return (<Row style={{ height: '100px', background: '#fbfbfb', padding: '0 15px', fontSize: '14px', marginBottom: '15px' }}>
            <Col style={style.col} span={12} >name:{this.props.name}</Col>
            <Col style={style.col} span={12} >zhName:{this.props.zhName}</Col>
            <Col style={style.col} span={24} >modelPath:{this.props.modelPath}</Col>
        </Row>)
    }
}