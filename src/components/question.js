
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

function QuestionHeader(props) {
  return (
    <aside className="question-header">
      <ul className="question-metadata">
        <li aria-label="Ερωτώντες" className="question-metadata__authors">
          <ul>
            {props.data.__by.map(author => (
              <li key={author._id}>
                <Link to={`/person/${author._id}`} title="Στοιχεία βουλευτή">
                  <div className="author__image">
                    {author.image
                     ? <img src={author.image.replace('imageoriginal', 'imagesmall')} />
                     : ''}
                  </div>
                </Link>
                <div className="author__name">
                  <Link to={{query: {searchScope: 'by',
                                     searchValue: author.name.el}}}>
                    {abbreviateFirstName(author.name.el)}
                  </Link>
                </div>
              </li>
             ))}
          </ul>
        </li>
        <li aria-label="Απαντήσεις" className="question-metadata__answers">
          <ul>
            {props.data.answers.map((answer, index) => (
              <li key={props.data._id + answer}>
                <a href={answer} rel="external">Α</a>
              </li>
            ))}
          </ul>
        </li>
        <li aria-label="Ημερομηνία" className="question-metadata__date">
          <time dateTime={props.data.date}>
            <Link to={{query: {searchScope: 'date',
                               searchValue: props.data.date}}}>
              {props.data.date.split('-').reverse().join('/')}
            </Link>
          </time>
        </li>
      </ul>
      <div aria-label="Αριθμός" className="question-id">
        <Link to={{query: {searchScope: 'identifier',
                           searchValue: props.data.identifier}}}>
          {props.data.identifier}
        </Link>
      </div>
    </aside>
  )
}

export function Question(props) {
  return (
    <article
        className={`question question--${props.data.answers.length === 0
                                         ? "unanswered" : "answered"}`}>
      <h2>{props.data.heading}</h2>
      <QuestionHeader data={props.data}/>
      <div
        className="question-text"
        dangerouslySetInnerHTML={{__html: marked(props.data.text.toString())}}/>
    </article>
  )
}
