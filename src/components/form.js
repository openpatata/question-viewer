
import _ from 'lodash';
import React from 'react';


export const Form = React.createClass({
  debounce: _.debounce((that, v) => that.props.updateHash({page: 0, searchValue: v}), 500),

  render() {
    return (
      <div className="question-form">
        <p className="question-form__results-info-text">
          {this.props.questionCount}{`${this.props.questionCount == 1
                                      ? " αποτέλεσμα"
                                      : " αποτελέσματα"}`}
        </p>
        <div className="question-form__search-array">
          <input
              type="search"
              placeholder="Αναζήτηση"
              defaultValue={this.props.initialSearchValue}
              onChange={e => this.debounce(this, e.target.value)}/>
          <select
              arial-label="Επιλογή πεδίων"
              defaultValue={this.props.initialSearchScope}
              onChange={e => this.props.updateHash({page: 0, searchScope: e.target.value})}>
            <option value="all">Όλα τα πεδία</option>
            <option value="by">Ερωτώντες</option>
            <option value="date">Ημερομηνία</option>
            <option value="identifier">Αριθμός</option>
            <option value="text">Κείμενο</option>
          </select>
        </div>
      </div>
    );
  }
});
