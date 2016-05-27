
import React from 'react';
import {Question} from './question.js';


class Pager extends React.Component {
  render() {
    return (
      <ul className="pagination">
        {this.props.pages.map(page => (
          <li className={`pagination__page${this.props.page == page
                                            ? " pagination__page--current"
                                            : ""}`}
              key={page}>
            <a data-page={page} onClick={this.props.pushToPage}>{page + 1}</a>
          </li>
        ))}
      </ul>
    );
  }
}

export class List extends React.Component {
  render() {
    return (
      <div>
        <div className="question-list">
          {this.props.questions.map(question => (
            <Question key={question._id} data={question}/>
          ))}
        </div>
        <Pager
          page={this.props.page}
          pages={this.props.pages}
          pushToPage={this.props.pushToPage}/>
      </div>
    );
  }
}
