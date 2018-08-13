import React, {Component} from 'react';

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
            fontWeight: 'bold'
        }
        return <p style={subtitleCss}> 槽位信息 </p>
    }

    render() {

        const style = {
            flexBox: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-start',
                flexDirection: 'column',
                minHeight: '200px',
                background: '#fbfbfb',
                padding: '15px',
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                marginBottom: '15px'
            },
            serveLi: {
                padding: '5px 0px',
                fontSize: '14px',
            },
            serveLiSpan: {
                marginRight: '15px',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'inline-block',
                marginBottom: '15px'
            },
        }

        return (
            <ul style={style.flexBox}>
                {this.getTitle()}
                {
                    this.props.entityParam.map((item, i) => {
                        return <li style={{...style.serveLi, color: '#fff'}} key={item.entity}>
                            <span style={{
                                ...style.serveLiSpan,
                                background: '#188ae2',
                                border: '1px solid ' + item.color + "'"
                            }}>{item.name}</span>
                            {item.valuesShow.map((value, index) => {
                                return <span style={{
                                    ...style.serveLiSpan,
                                    background: item.color,
                                    border: '1px solid ' + item.color + "'"
                                }} key={index}>{value}</span>
                            })}
                            {
                                item.values.length > 10 ? item.valuesShow.length <= 10 ?
                                    <span onClick={this.showMoreValues.bind(this, i)} style={{
                                        ...style.serveLiSpan,
                                        background: item.color,
                                        border: '1px solid ' + item.color + "'"
                                    }}>···</span> : <span onClick={this.showLessValues.bind(this, i)} style={{
                                        ...style.serveLiSpan,
                                        background: item.color,
                                        border: '1px solid ' + item.color + "'"
                                    }}>-</span> : ''
                            }
                        </li>
                    })
                }
            </ul>
        )
    }
}