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
            fontWeight: 'bold',
            marginBottom: '0px',
            lineHeight: '40px',
        }
        return <p style={subtitleCss}> 槽位信息 </p>
    }

    render() {

        const style = {
            entityContainer: {
                marginTop: '15px',
                background: '#fbfbfb',
                borderRadius: '15px',
                padding: '0 15px'
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
                <ul style={style.flexBox}>
                    {
                        this.props.entityParam.map((item, i) => {
                            return <li style={{...style.serveLi, color: '#fff'}} key={item.entity}>
                            <span style={{
                                ...style.serveLiSpan,
                                background: 'blue',
                                border: '1px solid ' + item.color + "'"
                            }}>{item.name}</span>
                                {item.valuesShow.map((value, index) => {
                                    return <span style={{
                                        ...style.serveLiSpan,
                                        background: 'blue',
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
            </div>

        )
    }
}