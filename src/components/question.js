
import marked from 'marked'
import React from 'react'
import {Link} from 'react-router-dom'


function QuestionHeader (props) {
  return (
    <aside className='question-header'>
      <ul className='question-metadata'>
        <li aria-label='Ερωτώντες' className='question-metadata__authors'>
          <ul>
            {props.data.__by.map(author => (
              <li key={author._id}>
                <Link to={`/person/${author._id}`} title='Στοιχεία βουλευτή'>
                  <div className='author__image'>
                    {author.image
                     ? <img src={author.image.replace('imageoriginal', 'imagesmall')} />
                     : ''}
                  </div>
                </Link>
                <div className='author__name'>
                  <Link to={{query: {searchField: 'by',
                                     searchValue: author.name.el}}}>
                    {author.name.el}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </li>
        <li aria-label='Ημερομηνία' className='question-metadata__date'>
          <time dateTime={props.data.date}>
            <Link to={{query: {searchField: 'date',
                               searchValue: props.data.date}}}>
              {props.data.date}
            </Link>
          </time>
        </li>
      </ul>
      <div aria-label='Αριθμός' className='question-id'>
        <Link to={{query: {searchField: 'identifier',
                           searchValue: props.data.identifier}}}>
          {props.data.identifier}
        </Link>
      </div>
    </aside>
  )
}

function QuestionFooter (props) {
  return (
    <aside className='question-footer'>
      <ul className='question-footer__answers'>
        {props.data.answers.map(answer => <li key={props.data._id + answer}>
          <a href={answer} rel='external'>Απάντηση</a>
        </li>)}
      </ul>
      <ul className='question-footer__misc'>
        <li><a href={props.data._sources[0]} rel='external'>Πηγή</a></li>
        <li><a href={`https://cdn.rawgit.com/openpatata/openpatata-data/master/questions/${props.data._id}.yaml`}
               rel='external'>Μηχανική παράσταση</a></li>
      </ul>
    </aside>
  )
}

export function Question (props) {
  return (
    <article className={`question question--${props.data.answers.length === 0
                                              ? 'unanswered' : 'answered'}`}>
      <h2>{props.data.heading}</h2>
      <QuestionHeader data={props.data} />
      <div className='question-text'
           dangerouslySetInnerHTML={{__html: marked(props.data.text.toString())}} />
      <QuestionFooter data={props.data} />
    </article>
  )
}
