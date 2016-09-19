
import marked from 'marked'
import React from 'react'
import {Link} from 'react-router'


function abbreviateFirstName(name) {
  const nameParts = name.split(' ')
  return nameParts
    .slice(0, (nameParts.length - 1))
    .concat([`${nameParts[nameParts.length - 1][0]}.`])
    .join(' ')
}

class QuestionHeader extends React.Component {
  render() {
    return (
      <aside className="question-header">
        <ul className="question-metadata">
          <li aria-label="Ερωτώντες" className="question-metadata__authors">
            <ul>
              {this.props.data.__byFull.map(author => (
                <li key={author._id}>
                  <Link to={`/person/${author._id}`}>
                    <div className="author__image">
                      {author.image
                       ? <img src={author.image.replace('imageoriginal', 'imagesmall')} />
                       : ''}
                    </div>
                  </Link>
                  <div className="author__name">
                    {abbreviateFirstName(author.name.el)}
                  </div>
                </li>
               ))}
            </ul>
          </li>
          <li aria-label="Απαντήσεις" className="question-metadata__answers">
            <ul>
              {this.props.data.answers.map((answer, index) => (
                <li key={this.props.data._id + answer}>
                  <a href={answer} rel="external">Α</a>
                </li>
              ))}
            </ul>
          </li>
          <li aria-label="Ημερομηνία" className="question-metadata__date">
            <time dateTime={this.props.data.date}>
              {this.props.data.date.split('-').reverse().join('/')}
            </time>
          </li>
        </ul>
        <div aria-label="Αριθμός" className="question-id">
          {this.props.data.identifier}
        </div>
      </aside>
    )
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
          dangerouslySetInnerHTML={{__html: marked(this.props.data.text.toString())}}/>
      </article>
    )
  }
}
