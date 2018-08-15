import React, {Component} from 'react';
import { Table } from 'antd'

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
            render(text, record, index) {
                return <span className='corpusSpan' style={{background: record.color}}>{text}</span>
            }
        }, {
            title: '槽位值',
            dataIndex: 'valuesShow',
            key: 'valuesShow',
            render(text, record, index) {
                return text.join()
            }
        }, {
            title: '展开',
            dataIndex: 'address',
            key: 'address',
            render(text, record, index) {
                return record.values.length > 10 ? record.valuesShow.length <= 10 ?
                    <span onClick={that.showMoreValues.bind(that, index)}>···</span> : <span onClick={that.showLessValues.bind(that, index)}>-</span> : ''
            }
        }]
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
            },
            flexBox: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-start',
                flexDirection: 'column',
                minHeight: '200px',
                background: '#fbfbfb',
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                marginBottom: '15px',
                overflow: 'auto',
            },
            serveLi: {
                fontSize: '14px',
                borderBottom: '1px solid blue'
            },
            serveLiSpan: {
                marginRight: '15px',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'inline-block',
                margin: '7px 15px 7px 0px'
            },
        }

        return (
            <div style={style.entityContainer}>
                {this.getTitle()}
                {/*<ul style={style.flexBox}>*/}
                    {/*{*/}
                        {/*this.props.entityParam.map((item, i) => {*/}
                            {/*return <li style={{...style.serveLi, color: '#fff'}} key={item.entity}>*/}
                            {/*<span style={{*/}
                                {/*...style.serveLiSpan,*/}
                                {/*background: 'blue',*/}
                                {/*border: '1px solid ' + item.color + "'"*/}
                            {/*}}>{item.name}</span>*/}
                                {/*{item.valuesShow.map((value, index) => {*/}
                                    {/*return <span style={{*/}
                                        {/*...style.serveLiSpan,*/}
                                        {/*background: 'blue',*/}
                                        {/*border: '1px solid ' + item.color + "'"*/}
                                    {/*}} key={index}>{value}</span>*/}
                                {/*})}*/}
                                {/*{*/}
                                    {/*item.values.length > 10 ? item.valuesShow.length <= 10 ?*/}
                                        {/*<span onClick={this.showMoreValues.bind(this, i)} style={{*/}
                                            {/*...style.serveLiSpan,*/}
                                            {/*background: item.color,*/}
                                            {/*border: '1px solid ' + item.color + "'"*/}
                                        {/*}}>···</span> : <span onClick={this.showLessValues.bind(this, i)} style={{*/}
                                            {/*...style.serveLiSpan,*/}
                                            {/*background: item.color,*/}
                                            {/*border: '1px solid ' + item.color + "'"*/}
                                        {/*}}>-</span> : ''*/}
                                {/*}*/}
                            {/*</li>*/}
                        {/*})*/}
                    {/*}*/}
                {/*</ul>*/}

                <Table
                    dataSource={this.props.entityParam}
                    columns={this.columns()}
                    bordered
                    pagination={false}
                />

            </div>

        )
    }
}