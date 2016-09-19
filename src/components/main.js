
import ld from 'lodash'
import React from 'react'
import {withRouter} from 'react-router'
import DocumentTitle from 'react-document-title'
import 'whatwg-fetch'

import {db} from '../index'
import {ListForm} from './form'
import {List, ListControls} from './list'
import {Load} from './load'
import {TimeSeries} from './timeSeries'


/**
 * Here's how this app works:
 *
 * 1. The query string is kept in sync with the form.
 * 2. The question list is refreshed from the query, `x` ms after
 *    the query string has been modified.  The timer is reset by every
 *    new change.
 * 3. On mounting the app, the values of the search box and the dropdown
 *    are populated from the query, making it possible to link to
 *    search results.
 *
 * And that's pretty much all there is to it.
 */

function fetchData({page = 0, searchScope = 'all', searchValue = null}) {
  return new Promise(resolve => setTimeout(() => {
    const params = !searchValue ? {} : (() => {
      const regex = new RegExp(searchValue, 'i')

      if (searchScope === 'all') {
        return {
          $or: ['date', 'identifier', 'text']
            .map(v => ({[v]: regex}))
            .concat({by: {
              mp_id: db.collection('mps').find({name: {el: regex}}).map(mp => mp._id)
            }})
        }
      } else if (searchScope === 'by') {
        return {[searchScope]: {
          mp_id: db.collection('mps').find({name: {el: regex}}).map(mp => mp._id)
        }}
      } else {
        return {[searchScope]: regex}
      }
    })()

    return resolve({
      page: parseInt(page),
      searchScope: searchScope,
      searchValue: searchValue,
      questionCount: db.collection('questions').count(params),
      questionDates: db.collection('questions').find(params, {date: 1}),
      questions: db.collection('questions').find(params, {
        $page: page,
        $limit: 20,
        $orderBy: {date: -1, _id: -1},
        $join: [{mps: {
          _id: 'by.mp_id',
          $as: '__byFull',
          $require: true,
          $multi: true
        }}]
      })
    })
  }))
}

export const Main = withRouter(React.createClass({
  componentDidMount() {
    this.props.router.listen(() => this.setState(
      // State must be non-empty to trigger UI update
      {questions: null},
      () => fetchData(this.props.location.query).then(
        nextState => this.setState(nextState)
      )
    ))
  },

  updateHash(values = {}) {
    this.props.router.push({
      query: Object.assign({}, this.props.location.query, values)
    })
  },

  render() {
    if (!this.state || !this.state.questions)
      return <Load/>
    else
      return (
        <DocumentTitle title={
          (this.state.searchValue ? `Αναζήτηση: ${this.state.searchValue} — ` : '') +
          'Ερωτήσεις Κυπρίων Βουλευτών'
        }>
          <div className="__main">
            <ListControls
              questionCount={this.state.questionCount}
              page={this.state.page}
              updateHash={this.updateHash}/>
            <TimeSeries questionDates={this.state.questionDates}/>
            <ListForm
              initialSearchScope={this.state.searchScope}
              initialSearchValue={this.state.searchValue}
              questions={this.state.questions}
              updateHash={this.updateHash}/>
            <List questions={this.state.questions}/>
          </div>
        </DocumentTitle>
    )
  }
}))
