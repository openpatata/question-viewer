
import _ from 'lodash';
import React from 'react';

import {Question} from './question';


const pageRange = 3;

export class List extends React.Component {
  render() {
    return (
      <div>
        <div className="question-list">
          {this.props.questions.map(question => (
            <Question key={question._id} data={question}/>
          ))}
        </div>
      </div>
    );
  }
}

export class Pager extends React.Component {
  calcPages(page, pages) {
    return _.flatten(_.union(
      [0], _.range(page - pageRange, page + pageRange + 1), [pages - 1]
    ).filter(page => page >= 0 && page < pages).map(
      function (page) {
        let prev = parseInt(this.prev);
        this.prev = page;
        if (page - 1 === prev)
          return [page];
        return [_.uniqueId('dummy'), page];
      },
      {prev: -1}
    ));
  }

  render() {
    return (
      <ul className="pagination">
        {this.calcPages(this.props.page, this.props.pages).map(page => (
          <li className={`pagination__page${this.props.page == page
                                            ? " pagination__page--current"
                                            : ""}`}
              key={page}>
            {typeof page === 'string' ? '...' :
             <a data-page={page} onClick={e => this.props.updateHash(
                                          {page: e.target.dataset.page})}>
              {page + 1}
             </a>}
          </li>
        ))}
      </ul>
    );
  }
}
