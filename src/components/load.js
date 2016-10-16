
import ld from 'lodash'
import React from 'react'


const pepTalk = [
  'Βάσταξε',
  'Πόμινε',
  'Πομονήν τζαι κράτην',
  'Η υπομονή εν αρετή'
]

export function Load () {
  return (
    <div className='loading'>
      <div className='loading__spinner' />
      {pepTalk[ld.random(pepTalk.length - 1)]}
    </div>
  )
}
