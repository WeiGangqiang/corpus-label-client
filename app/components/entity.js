import React, {Component} from 'react';
import { Table , Icon} from 'antd'

export class EntityParameters extends Component {
    constructor(props) {
        super(props)
    }

    showMoreValues(i) {
        this.props.showMoreValues(i)
    }

    showLessValues(i) {
        this.props.showLessValues(i)
    }

    getTitle = () => {
        const subtitleCss = {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '0px',
            lineHeight: '40px',
        }
        return <p style={subtitleCss}> 槽位信息 </p>
    }

    columns = () => {
        const that = this

        return [{
            title: '槽位名',
            dataIndex: 'entity',
            key: 'entity',
            width: '20%',
            className: 'tableIndex',
            render(text, record, index) {
                return <span className='corpusSpan' style={{background: record.color}}>{text}</span>
            }
        }, {
            title: '槽位值',
            dataIndex: 'valuesShow',
            key: 'valuesShow',
            width: '80%',
            render(text, record, index) {
                if(record.values.length < 10){
                    return (<div> <span> {text.join()} </span></div>)
                } else if(record.valuesShow.length <= 10){
                    return (<div> 
                        <span>  {text.join()} </span>
                        <span style={{paddingLeft: '2px', fontWeight: 'bold', color:record.color}} onClick={that.showMoreValues.bind(that, index)}><Icon type='plus'/></span>
                        </div>)
                } else {
                    return (<div> 
                        <span>  {text.join()} </span>
                        <span style={{paddingLeft: '2px', fontWeight: 'bold', color:record.color}}  onClick={that.showLessValues.bind(that, index)}><Icon type='minus'/></span>
                        </div>)
                }
            }
        }
    ]
    }

    render() {
        const style = {
            entityContainer: {
                marginTop: '15px',
                background: '#fbfbfb',
                borderRadius: '15px',
                marginBottom: '15px',
                padding: '0 15px',
                paddingEnd: '10px'
            }
        }

        return (
            <div style={style.entityContainer}>
                {this.getTitle()}
                <Table
                    dataSource={this.props.entityParam}
                    columns={this.columns()}
                    bordered
                    pagination={false}
                />
                <div style={{ height: '10px' }}> </div>
            </div>

        )
    }
}