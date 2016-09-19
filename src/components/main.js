
import React from 'react'
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
export const Main = React.createClass({
  componentWillMount() {
    this.updateHash()
  },

  updateHash(values = {}) {
    this.props.history.push({
      query: Object.assign({}, this.props.location.query, values)
    })
    // State value must be non-empty to trigger UI update
    this.setState({questions: null}, this.refreshData)
  },

  refreshData(
    {page = 0, searchScope = 'all', searchValue = null} = this.props.location.query
  ) {
    new Promise(resolve => setTimeout(() => {
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

      return resolve([
        db.collection('questions').count(params),
        db.collection('questions').find(params, {date: 1}),
        db.collection('questions').find(params, {
          $page: page,
          $limit: 20,
          $orderBy: {date: -1, _id: -1},
          $join: [{mps: {
            $where: {$query: {_id: '$$.by.mp_id'}},
            $as: '__byFull',
            $require: true,
            $multi: true
          }}]
        })
      ])
    }, 0)).then(([questionCount, questionDates, questions]) => {
      this.setState({
        docTitle: `${searchValue
                     ? `Αναζήτηση: ${searchValue} — ` : ''}Ερωτήσεις Κυπρίων Βουλευτών`,
        page: parseInt(page),
        pages: Math.ceil(questionCount / 20),
        questionCount: questionCount,
        questionDates: questionDates,
        questions: questions
      })
    })
  },

  render() {
    return (
      <DocumentTitle title={this.state.docTitle}>
        <div className="__main">
          <ListControls
            questionCount={this.state.questionCount}
            initialPage={this.state.initialPage}
            page={this.state.page}
            pages={this.state.pages}
            updateHash={this.updateHash}/>
          <TimeSeries questionDates={this.state.questionDates}/>
          <ListForm
            initialSearchScope={this.props.location.query.searchScope}
            initialSearchValue={this.props.location.query.searchValue}
            questions={this.state.questions}
            updateHash={this.updateHash}/>
          {this.state.questions
           ? <List questions={this.state.questions}/> : <Load/>}
        </div>
      </DocumentTitle>
    )
  }
})
