
import ld from 'lodash'
import React from 'react'


const pepTalk = [
  'Βάσταξε',
  'Πόμινε',
  'Υπομονήν τζαι κράτην',
  'Η υπομονή εν αρετή'
]

export class Load extends React.Component {
  render() {
    return (
      <div className="loading">
        <div className="loading__spinner"/>
        {pepTalk[ld.random(pepTalk.length - 1)]}
      </div>
    )
  }
}
