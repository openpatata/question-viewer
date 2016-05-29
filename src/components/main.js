
import _ from 'lodash';

import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory} from 'react-router';

import {Form} from './form.js';
import {List} from './list.js';


export class Main extends React.Component {
  /* Here's how this app works:
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

  constructor(props) {
    super(props);

    for (let i of ['updateHistory', 'pushToPage',
                   'pushToScope', 'pushToValue']) {
      this[i] = this[i].bind(this);
    }
    this.refreshData = _.debounce(this.refreshData.bind(this), 500);

    hashHistory.listen(location => {
      this.query = location.query;
      this.refreshData(location.query);
    });
  }

  componentWillMount() {
    this.setState({
      pages: [],
      questions: [],
      initialSearchScope: this.query.searchScope,
      initialSearchValue: this.query.searchValue,
    });
  }

  updateHistory(values) {
    hashHistory.replace({query: Object.assign({}, this.query, values)});
  }

  pushToPage(event_) {
    this.updateHistory({page: parseInt(event_.target.dataset.page)});
  }

  pushToScope(event_) {
    this.updateHistory({page: 0, searchScope: event_.target.value});
  }

  pushToValue(event_) {
    this.updateHistory({page: 0, searchValue: event_.target.value});
  }

  refreshData({page = 0, searchScope = 'all', searchValue = null} = {}) {
    let params, filters = {$page: page, $limit: 20, $orderBy: {date: -1}};
    if (!searchValue) {
      params = {};
    } else if (searchScope === 'all') {
      let regex = new RegExp(searchValue, 'i');
      params = {
        $or: ['by', 'date', 'identifier', 'text'].map(v => ({[v]: regex}))
      };
    } else {
      params = {[searchScope]: new RegExp(searchValue, 'i')};
    }

    let questionCount = this.props.col.count(params);
    let pages = _.range(_.ceil(questionCount / 20));
    this.setState({
      page: page,
      pages: pages,
      questionCount: questionCount,
      questions: this.props.col.find(params, filters)
    });
  }

  render() {
    return (
      <div>
        <Form
          initialSearchScope={this.state.initialSearchScope}
          initialSearchValue={this.state.initialSearchValue}
          pushToValue={this.pushToValue}
          pushToScope={this.pushToScope}
          resultCount={this.state.questionCount}/>
        <List
          pushToPage={this.pushToPage}
          page={this.state.page}
          pages={this.state.pages}
          questions={this.state.questions}/>
      </div>
    );
  }
}
