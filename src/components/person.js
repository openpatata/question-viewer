
import React from 'react'
import DocumentTitle from 'react-document-title'

import {db} from '../index'
import {Load} from './load'


function formatDates(pperiods, pperiod_id) {
  const pperiod = pperiods.filter(i => i._id == pperiod_id)[0]
  return [pperiod.start_date, pperiod.end_date].join('–')
}

function selectLink(links, url) {
  return (links.filter(l => l.url.indexOf(url) >= 0)[0] || {}).url
}

export const Person = React.createClass({
  componentWillMount() {
    new Promise(resolve => setTimeout(() => resolve(
      db.collection('mps').findOne({_id: this.props.params.personId}, {
        $join: [{electoral_districts: {
          _id: 'tenures.electoral_district_id',
          $as: '__electoral_districts',
          $require: true,
          $multi: true
        }}, {parliamentary_periods: {
          _id: 'tenures.parliamentary_period_id',
          $as: '__parliamentary_periods',
          $require: true,
          $multi: true
        }}, {parties: {
          _id: 'tenures.party_id',
          $as: '__parties',
          $require: true,
          $multi: true
        }}]
      })
    ))).then(person => this.setState({data: person}))
  },

  render() {
    if (!this.state)
      return <Load/>
    return (
      <DocumentTitle title={`Προφίλ: ${this.state.data.name.el} — Ερωτήσεις Κυπρίων Βουλευτών`}>
        <div className="__person">
          <h2>{this.state.data.name.el}</h2>
          <div className="mugshot">
            {this.state.data.image ? <img src={this.state.data.image}/> : ''}
          </div>
          <h3>Στοιχεία επικοινωνίας</h3>
          <dl>
            <dt>E-mail</dt>
            <dd><a href={`mailto:${this.state.data.email}`}>
              {this.state.data.email}</a></dd>
            <dt>Τηλέφωνο</dt>
            <dd>{(this.state.data
                  .contact_details
                  .filter(c => c.type == 'voice' && c.note == 'parliament')[0] || {})
                 .value}</dd>
            <dt>Twitter</dt>
            <dd><a href={selectLink(this.state.data.links, 'twitter.com')}
                   ref="external">
              {(selectLink(this.state.data.links, 'twitter.com') || '')
               .replace(/.*\//, '')}</a></dd>
          </dl>
          <h3>Προσωπικά στοιχεία</h3>
          <dl>
            <dt>Ημερομηνία γέννησης</dt>
            <dd>{this.state.data.birth_date}</dd>
            <dt>Καταγωγή</dt>
            <dd>{(this.state.data.place_of_origin || {}).el}</dd>
          </dl>
          <h3>Βουλευτική θητεία</h3>
          <p><i>Δεν υπάρχουν πληροφορίες πριν το 2001.</i></p>
          <table className="tenure-table">
            <thead>
              <tr>
                <td>Περίοδος</td>
                <td>Διάρκεια</td>
                <td>Παράταξη</td>
                <td>Περιφέρεια</td>
              </tr>
            </thead>
            <tbody>
              {this.state.data.tenures.map((t, i) => (
                <tr key={i}>
                  <td>{this.state.data.__parliamentary_periods
                       .filter(i => i._id == t.parliamentary_period_id)[0].number.el}</td>
                  <td>{formatDates(this.state.data.__parliamentary_periods,
                                   t.parliamentary_period_id)}</td>
                  <td>{this.state.data.__parties
                       .filter(i => i._id == t.party_id)[0].abbreviation.el}</td>
                  <td>{this.state.data.__electoral_districts
                       .filter(i => i._id == t.electoral_district_id)[0].name.el}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Πηγές</h3>
          <ul>
            {this.state.data._sources.map(s =>
              <li><a href={s} ref="external">{s}</a></li>
            )}
          </ul>
          <div className="raw-data">
            <h3>Μηχανική παράσταση</h3>
            <pre>{JSON.stringify(this.state.data, null, '  ')}</pre>
          </div>
        </div>
      </DocumentTitle>
    )
  }
})
