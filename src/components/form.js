
import ld from 'lodash'
import React from 'react'


const debounceInput = ld.debounce(
  (updateHash, value) => updateHash({page: 0, searchValue: value}),
  1000
)

export function ListForm (props) {
  return (
    <div className='question-form'>
      <div className='question-form__search-array'>
        <input
          type='search'
          placeholder='Αναζήτηση'
          defaultValue={props.defaultSearchValue}
          onChange={e => debounceInput(props.updateHash, e.target.value)}
          autoFocus
        />
        <select arial-label='Επιλογή πεδίων'
            defaultValue={props.defaultSearchField}
            onChange={e => props.updateHash({page: 0, searchField: e.target.value})}>
          <option value='all'>Όλα τα πεδία</option>
          <option value='by'>Ερωτώντες</option>
          <option value='date'>Ημερομηνία</option>
          <option value='identifier'>Αριθμός</option>
          <option value='text'>Κείμενο</option>
          <option value='settlement'>Τοποθεσία</option>
        </select>
        <div className='question-form__status-toggles'>
          <input
            id='__answered'
            className='answered'
            type='checkbox'
            value='showAswered'
            defaultChecked={props.defaultShowAnswered}
            onClick={e => props.updateHash({page: 0, showAnswered: e.target.checked})}
          />
          <label
            htmlFor='__answered'
            title='Eμφάνιση απαντημένων ερωτήσεων' />
          <input
            id='__unanswered'
            className='unanswered'
            type='checkbox'
            value='showUnanswered'
            defaultChecked={props.defaultShowUnanswered}
            onClick={e => props.updateHash({page: 0, showUnanswered: e.target.checked})}
          />
          <label
            htmlFor='__unanswered'
            title='Eμφάνιση αναπάντητων ερωτήσεων' />
        </div>
      </div>
    </div>
  )
}
