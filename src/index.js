
import './index.scss'
import './../build/CNAME'
import './../build/electoral_districts.json'
import './../build/mps.json'
import './../build/parliamentary_periods.json'
import './../build/parties.json'
import './../build/question_settlements.json'
import './../build/questions.json'
import './../build/settlements.json'

import ForerunnerDB from 'forerunnerdb'
import ld from 'lodash'
import React from 'react'
import {render} from 'react-dom'
import {Router, Route} from 'react-router-dom'
import createHashHistory from 'history/createHashHistory'
import qhistory from 'qhistory'
import {stringify, parse} from 'qs'

import {About} from './components/about'
import {Load} from './components/load'
import {Main} from './components/main'
import {Person} from './components/person'


function insertAsync (col, data) {
  return new Promise(resolve => db.collection(col).insert(data, resolve))
}

export const db = window.db = (new ForerunnerDB()).db()
export const history = qhistory(
  createHashHistory(),
  stringify,
  parse
)

const elMain = document.querySelector('main')

render(
  <Load />,
  elMain
)

Promise.all(ld.values(elMain.dataset).map(d => fetch(d))) // eslint-disable-line no-undef
  .then(o => Promise.all(o.map(d => d.json())))
  .then(([
    electoralDistricts, mps, parliamentaryPeriods, parties,
    questionSettlements, questions, settlements
  ]) => Promise.all([
    insertAsync('electoral_districts', electoralDistricts),
    insertAsync('mps', mps),
    insertAsync('parliamentary_periods', parliamentaryPeriods),
    insertAsync('parties', parties),
    insertAsync('question_settlements', questionSettlements),
    insertAsync('questions', questions),
    insertAsync('settlements', settlements)
  ]))
  .then(() => render(
    <Router history={history}>
      <div>
        <Route exact path='/' component={Main} />
        <Route path='/about' component={About} />
        <Route path='/person/:personId' component={Person} />
      </div>
    </Router>,
    elMain
  ))
