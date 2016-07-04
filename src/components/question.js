
import marked from 'marked';
import React from 'react';

import {db} from '../index';


class QuestionHeader extends React.Component {
  render() {
    return (
      <aside className="question-header">
        <ul className="question-details">
          <li aria-label="Ημερομηνία" className="question-details__date">
            <time>
              <a onClick={this.props.fillFromLink}>{this.props.data.date}</a>
            </time>
          </li>
          <li aria-label="Ερωτώντες" className="question-details__authors">
            <ul>
              {this.props.data.by.map(author => (
                <li key={this.props.data._id + author.mp_id}>
                  <a onClick={this.props.fillFromLink}>{db.collection('mps').findById(author.mp_id).name.el}</a>
                </li>
               ))}
            </ul>
          </li>
          <li aria-label="Απαντήσεις" className="question-details__answers">
            <ul>
              {this.props.data.answers.map((answer, index) => (
                <li key={this.props.data._id + answer}>
                  <a href={answer} rel="external">{index + 1}</a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <div aria-label="Αριθμός" className="question-id">
          {this.props.data.identifier}
        </div>
      </aside>
    );
  }
}

export class Question extends React.Component {
  render() {
    return (
      <article
          className={`question question--${this.props.data.answers.length === 0
                                           ? "unanswered" : "answered"}`}>
        <h2>{this.props.data.heading}</h2>
        <QuestionHeader data={this.props.data}/>
        <div
          className="question-text"
          dangerouslySetInnerHTML={{__html: marked(this.props.data.text.toString())}}
          />
      </article>
    );
  }
}
