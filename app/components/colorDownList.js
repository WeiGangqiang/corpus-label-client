import React,{ Component } from 'react';

export class ColorDownList extends Component{
  constructor(props){
    super(props)
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
                    this.props.entityParam.map(entity => {
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
                    this.props.phraseArray.map(phrase => {
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