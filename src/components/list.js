
import ld from 'lodash'
import React from 'react'
import {Link} from 'react-router-dom'

import {Question} from './question'


const formatNumber = new Intl.NumberFormat('el').format

const pageRange = 3

function genPagination (page, questionCount) {
  const pages = Math.ceil(questionCount / 20)
  return ld(
    ld.union([0], ld.range(page - pageRange, page + pageRange + 1), [pages - 1])
  )
    .filter(page => page >= 0 && page < pages)
    .transform((result, page) => Array.prototype.push.apply(
      result,
      (!result.length || page - 1 === result[result.length - 1]
       ? [page] : [ld.uniqueId('dummy'), page])))
    .value()
}

export function List (props) {
  return (
    <div className='question-list'>
      {props.questions.map(question =>
        <Question key={question._id} data={question} />
      )}
    </div>
  )
}

export function ListControls (props) {
  return (
    <div className='list-controls'>
      <p className='list-controls__result-count'>
        {formatNumber(props.questionCount)}{`${props.questionCount === 1
                                               ? ' αποτέλεσμα'
                                               : ' αποτελέσματα'}`}
      </p>
      <ListPager
        page={props.page}
        questionCount={props.questionCount}
        updateHash={props.updateHash}
      />
    </div>
  )
}

function ListPager (props) {
  return (
    <ul className='pagination'>
      {genPagination(props.page, props.questionCount).map(page => (
        <li className={`pagination__page${props.page === page
                                          ? ' pagination__page--current'
                                          : ''}`}
            key={page}>
          {typeof page === 'string' ? '…'
           : <a onClick={() => props.updateHash({page: page})}>
             {page + 1}
           </a>}
        </li>
      ))}
    </ul>
  )
}
