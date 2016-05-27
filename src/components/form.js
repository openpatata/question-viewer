
import React from 'react';


export class Form extends React.Component {
  render() {
    return (
      <div className="question-form">
        <p className="question-form__results-info-text">
          {this.props.resultCount}{`${this.props.resultCount == 1
                                      ? " αποτέλεσμα"
                                      : " αποτελέσματα"}`}
        </p>
        <div className="question-form__search-array">
          <input
              type="search"
              placeholder="Αναζήτηση"
              defaultValue={this.props.initialSearchValue}
              onChange={this.props.pushToValue}/>
          <select
              arial-label="Επιλογή τιμών"
              onChange={this.props.pushToScope}
              defaultValue={this.props.initialSearchScope}>
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
}
