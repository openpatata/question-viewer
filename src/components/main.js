
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


function parseBool(value) {
  return value === true || value === 'true'
}

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

function fetchData(prevState, {
  page = 0, searchField = 'all', searchValue = null,
  showAnswered = true, showUnanswered = true
}) {
  return new Promise((resolve, reject) => setTimeout(() => {
    let params

    showAnswered = parseBool(showAnswered)
    showUnanswered = parseBool(showUnanswered)
    if (!showAnswered && !showUnanswered) {
      // Flip state if attempting to toggle both off
      if (prevState.showAnswered === true) {
        showUnanswered = true
      } else if (prevState.showUnanswered === true) {
        showAnswered = true
      } else {
        // This should only arise from editing the query string manually
        // _and_ if having purged the location history (programmatically or
        // e.g. by pasting the URL in a new tab)
        showAnswered = true
        showUnanswered = true
      }
      return reject({showAnswered: showAnswered, showUnanswered: showUnanswered})
    } else if (!showAnswered) {
      params = {$count: {answers: 0}}
    } else if (!showUnanswered) {
      params = {$count: {answers: {$gt: 0}}}
    }

    if (searchValue) {
      params = Object.assign({}, params, (() => {
        let searchString
        try {
          searchString = new RegExp(searchValue, 'i')
        } catch (e) {
          searchString = searchValue
        }

        if (searchField === 'all') {
          return {
            $or: ['date', 'identifier', 'text']
              .map(v => ({[v]: searchString}))
              .concat({by: {
                mp_id: db.collection('mps')
                  .find({name: {el: searchString}}).map(mp => mp._id)
              }})
          }
        } else if (searchField === 'by') {
          return {[searchField]: {
            mp_id: db.collection('mps')
              .find({name: {el: searchString}}).map(mp => mp._id)
          }}
        } else if (searchField === 'settlement') {
          return {
            _id: ld(db.collection('question_settlements').find({
                _id: db.collection('settlements').find({name: searchString})
                  .map(s => s._id)
              }))
              .map(l => l.question_ids)
              .flatten()
              .uniq()
              .value()
          }
        } else {
          return {[searchField]: searchString}
        }
      })())
    }

    return resolve({
      page: parseInt(page),
      searchField: searchField,
      searchValue: searchValue,
      showAnswered: showAnswered,
      showUnanswered: showUnanswered,
      questionCount: db.collection('questions').count(params),
      questionDates: db.collection('questions').find(params, {date: 1}),
      questions: db.collection('questions').find(params, {
        $page: page,
        $limit: 20,
        $orderBy: {date: -1, _id: -1},
        $join: [{mps: {
          _id: 'by.mp_id',
          $as: '__by',
          $require: true,
          $multi: true
        }}]
      })
    })
  }))
}

export const Main = withRouter(React.createClass({
  componentWillMount() {
    this.props.router.listen(() => this.setState(
      // State must be non-empty to trigger UI update
      {questions: null},
      () => fetchData(this.state, this.props.location.query)
        .then(nextState => this.setState(nextState))
        .catch(queryCorrection => this.updateHash(queryCorrection))
    ))
  },

  updateHash(values = {}) {
    this.props.router.push({
      query: Object.assign({}, this.props.location.query, values)
    })
  },

  render() {
    if (!(this.state || {}).questions)
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
              defaultSearchField={this.state.searchField}
              defaultSearchValue={this.state.searchValue}
              defaultShowAnswered={this.state.showAnswered}
              defaultShowUnanswered={this.state.showUnanswered}
              questions={this.state.questions}
              updateHash={this.updateHash}/>
            <List questions={this.state.questions}/>
          </div>
        </DocumentTitle>
    )
  }
}))
