import React, {Component} from 'react';
import {Row, Col} from 'antd'

export class IntentDesc extends Component {
    constructor(props) {
        super(props)
    }


    getTitle = () => {
        const subtitleCss = {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '0px',
            lineHeight: '40px'
        }
        return <p style={subtitleCss}> 基本信息 </p>
    }

    render() {
        const style = {
            baseInfo: {
                height: '120px',
                background: '#fbfbfb',
                padding: '0 15px',
                fontSize: '14px',
                marginBottom: '15px',
                borderRadius: '15px'

            },
            col: {
                lineHeight: '40px'
            },
        };

        return (<div>
            <Row style={style.baseInfo}>
                {this.getTitle()}
                <Col style={style.col} span={10}>意图名字 ： {this.props.name}</Col>
                <Col style={style.col} span={10}>中文名字 ： {this.props.zhName}</Col>
                <Col style={style.col} span={4}>类型 ： {this.props.mode}</Col>
                <Col style={style.col} span={24}>模型路径 ： {this.props.modelPath}</Col>
            </Row></div>)
    }
}