import React,{ Component } from 'react';
import { connect } from 'react-redux'
import { fetchEntity, getPhrase } from 'actions/intend'

@connect((state, dispatch) => ({
}))
export class ColorDownList extends Component{
  constructor(props){
    super(props)
    this.state={
      phraseArray: [],
      entityParam: []
    }
  }

  componentWillMount() {
    this.props.dispatch(fetchEntity('?agent=' + agentName + '&intentId=' + obj.intentId, data => {
      for(let i=0;i<data.length;i++){
        data[i].valuesF = [...data[i].values]
        for(let j=0;j<data[i].valuesF.length;j++){
          let reg = /[\[\]]/g
          let labelReg = /\/L[0-9]/g
          data[i].valuesF[j] = data[i].valuesF[j].replace(reg,'').replace(labelReg, '')
        }
        data[i].valuesShow = [...data[i].valuesF.slice(0,10)]
      }
      this.setState({
        entityParam: [...data]
      })
    }, error => {

    }))
    this.props.dispatch(getPhrase('?agent=' + agentName + '&intentId=' + obj.intentId
        , data => {
          this.setState({
            phraseArray: [...data]
          })
        }, error => {
          console.log(error)
        }))
  }

  setEntity() {

  }

  setPhrase() {

  }

  addNewPhrase() {

  }

  render() {
    return (
        <div>
          <ul>
            <li>
              <h3>标注</h3>
              <div>
                <ul>
                  {
                    this.state.entityParam.map(entity => {
                      return <li onClick={this.setEntity.bind(this)}>{entity.name}</li>
                    })
                  }
                </ul>
              </div>
            </li>
            <li>
              <h3>近义词</h3>
              <div>
                <ul>
                  <li onClick={this.addNewPhrase.bind(this)}>新增近义词</li>
                  {
                    this.state.phraseArray.map(phrase => {
                      return <li onClick={this.setPhrase.bind(this)}>{phrase.phraseId}</li>
                    })
                  }
                </ul>
              </div>
            </li>
          </ul>
        </div>

    )
  }
}