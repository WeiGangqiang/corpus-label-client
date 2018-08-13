import React, {Component} from 'react';

export class IntentList extends Component {
    constructor(props) {
        super(props);
    }

    getIntent(item, index) {
        this.props.getIntent(item, index)
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
            intendBox: {
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
            }
        }

        return (
            <div className='intentSlide' style={style.intendBox}>
                <div style={{...style.corpusBox, display: this.props.originEntity.length ? 'block' : 'none'}}>
                    {this.props.originEntity.length ? this.props.intentId.length && this.props.originEntity.length == 1 ?
                        <div style={style.headerTitle}>选择的意图</div> : <div style={style.headerTitle}>请选择所属意图</div> : ''}
                    <div style={{height: '100%', overflowY: 'auto'}}>
                        <ul style={style.flexBox}>
                            {
                                this.props.originEntity.map((item, index) => {
                                    return <li className={item.intentId == this.props.intentId ? 'active-btn' : ''}
                                               onClick={this.getIntent.bind(this, item, index)} style={style.serveLi}
                                               key={item.intentId}>{item.zhName || item.name}</li>
                                })
                            }
                        </ul>
                    </div>
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