import React, {Component} from 'react';
import { Form, Input, Col, Row, message, Icon, Modal} from 'antd'


@Form.create({
    onFieldsChange(props, items) {
    },
})

export class EntityDesc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    deleteEntity() {
      this.hideModal()
      if(this.props.entity.mode!='local'){
        this.props.deleteEntity(this.props.entity)
      }else{
          message.info('该实体不允许删除')
      }
    }

    hideModal() {
      this.setState({
        visible: false
      })
    }

    toDeleteEntity() {
      this.setState({
        visible:true
      })
    }

    getTitle() {
      const style = {
          subtitleCss: {
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '0px',
              lineHeight: '55px'
          },
          box:{
              borderBottom: '1px solid #dadada',
              marginBottom: '10px'
          }
      }

      return <div style={style.box}>
          <Icon type="delete" onClick={this.toDeleteEntity.bind(this)}  className='edit-icon'/> 
          <p style={style.subtitleCss}> 基本信息 </p>
          <Modal
                title='删除提示'
                visible={this.state.visible}
                centered
                destroyOnClose="true"
                onCancel={this.hideModal.bind(this)}
                onOk={this.deleteEntity.bind(this)}
            >
                你确定要删除实体吗？
            </Modal>
      </div>
    }

    render() {
        const style = {
          entityContainer: {
            marginTop: '15px',
            background: '#fbfbfb',
            borderRadius: '15px',
            marginBottom: '15px',
            padding: '0 15px',
            paddingEnd: '10px',
            overflow: 'auto'
          },
          baseInfo: {
            height: 'auto',
            background: '#fbfbfb',
            padding: '0 15px',
            fontSize: '14px',
            marginBottom: '30px',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px'
          },
          col: {
            lineHeight: '40px',
            paddingLeft: '70px'
          },
          span: {
            float: 'left',
            width: '70px',
            marginLeft: '-70px'
          },
        };

        return (
          <div style={style.entityContainer}>
            {this.getTitle()}
            <Row style={style.baseInfo}>
                <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                  <span style={style.span}>名字:</span>
                  <div>{this.props.entity&&this.props.entity.name}</div>
                </Col>
                <Col style={style.col} span={10} xs={24} sm={12} xl={10}>
                  <span style={style.span}>中文名字:</span>
                  <div>{this.props.entity&&this.props.entity.zhName}</div>
                </Col>
                <Col style={style.col} span={4} xs={24} sm={12} xl={4}>
                  <span style={style.span}>类型:</span>
                  <div>枚举</div>
                </Col>
            </Row>

          </div>
        )
    }
}