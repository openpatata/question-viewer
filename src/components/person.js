
import React from 'react'
import DocumentTitle from 'react-document-title'

import {db} from '../index'
import {Load} from './load'


export const Person = React.createClass({
  componentWillMount() {
    new Promise(resolve => setTimeout(() => resolve(
      db.collection('mps').findOne({_id: this.props.params.personId})
    ))).then(person => this.setState({data: person}))
  },

  render() {
    if (!this.state)
      return <Load/>
    return (
      <DocumentTitle title={`Προφίλ: ${this.state.name} — Ερωτήσεις Κυπρίων Βουλευτών`}>
        <div className="__person">
          <button className="back-button" onClick={this.props.history.goBack}>Επιστροφή</button>
          <h2>{this.state.data.name.el}</h2>
          <pre>{JSON.stringify(this.state.data, null, '  ')}</pre>
        </div>
      </DocumentTitle>
    )
  }
})
