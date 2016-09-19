
import ld from 'lodash'
import React from 'react'


const debounceInput = ld.debounce(
  (updateHash, value) => updateHash({page: 0, searchValue: value}),
  500
)

export function ListForm(props) {
  return (
    <div className="question-form">
      <div className="question-form__search-array">
        <input
            type="search"
            placeholder="Αναζήτηση"
            defaultValue={props.initialSearchValue}
            onChange={e => debounceInput(props.updateHash, e.target.value)}
            autoFocus/>
        <select
            arial-label="Επιλογή πεδίων"
            defaultValue={props.initialSearchScope}
            onChange={e => props.updateHash({page: 0, searchScope: e.target.value})}>
          <option value="all">Όλα τα πεδία</option>
          <option value="by">Ερωτώντες</option>
          <option value="date">Ημερομηνία</option>
          <option value="identifier">Αριθμός</option>
          <option value="text">Κείμενο</option>
        </select>
      </div>
    </div>
  )
}
