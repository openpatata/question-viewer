
import React from 'react';
import DocumentTitle from 'react-document-title';
import 'whatwg-fetch';

import {Form} from './form';
import {List, Pager} from './list';
import {Load} from './load';
import {db} from '../index';


const insertAsync = (col, data) => new Promise(resolve => {
  db.collection(col).insert(data, resolve);
});

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
    this.props.history.listen(location => {
      this.query = location.query;
    });
  },

  componentDidMount() {
    Promise.all(
      [fetch(this.props.mpsUrl), fetch(this.props.questionsUrl)]
    ).then(([mps, questions]) =>
      Promise.all([mps.json(), questions.json()])
    ).then(([mps, questions]) =>
      Promise.all([insertAsync('mps', mps), insertAsync('questions', questions)])
    ).then(() => this.updateHash());
  },

  updateHash(values = {}) {
    this.props.history.push({query: Object.assign({}, this.query, values)});
    this.setState({questions: null}, this.refreshData);
  },

  refreshData({page = 0, searchScope = 'all', searchValue = null} = this.query) {
    (new Promise(resolve => window.setTimeout(() => {
      let params, filters = {$page: page, $limit: 20, $orderBy: {date: -1, _id: -1}};
      if (!searchValue) {
        params = {};
      } else if (searchScope === 'all') {
        let regex = new RegExp(searchValue, 'i');
        params = {
          $or: [
            'date', 'identifier', 'text'
          ].map(v => ({[v]: regex}))
           .concat({by: {mp_id: db.collection('mps').find({name: {el: regex}})
                                                    .map(mp => mp._id)}})
        };
      } else if (searchScope === 'by') {
        let mps = db.collection('mps').find({name: {el: new RegExp(searchValue, 'i')}})
                                      .map(mp => mp._id);
        params = {[searchScope]: {mp_id: mps}};
      } else {
        params = {[searchScope]: new RegExp(searchValue, 'i')};
      }
      return resolve([
        db.collection('questions').count(params),
        db.collection('questions').find(params, filters)
      ]);
    }, 0))).then(([questionCount, questions]) => {
      this.setState({
        docTitle: `Ερωτήσεις Κυπρίων Βουλευτών${searchValue ? `: ${searchValue}` : ''}`,
        page: parseInt(page),
        pages: Math.ceil(questionCount / 20),
        questionCount: questionCount,
        questions: questions
      });
    });
  },

  render() {
    if (!this.state)
      return <Load />;
    return (
      <DocumentTitle title={this.state.docTitle}>
        <div>
          <Form
            initialSearchScope={this.query.searchScope}
            initialSearchValue={this.query.searchValue}
            questionCount={this.state.questionCount}
            updateHash={this.updateHash} />
          {this.state.questions
            ? <div>
                <List questions={this.state.questions} />
                <Pager
                  initialPage={this.state.initialPage}
                  page={this.state.page}
                  pages={this.state.pages}
                  updateHash={this.updateHash} />
              </div>
            : <Load />}
        </div>
      </DocumentTitle>
    );
  }
});
