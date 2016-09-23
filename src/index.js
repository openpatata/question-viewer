
import './index.scss'
import './../build/electoral_districts.json'
import './../build/mps.json'
import './../build/parliamentary_periods.json'
import './../build/parties.json'
import './../build/questions.json'

import ForerunnerDB from 'forerunnerdb'
import ld from 'lodash'
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import {About} from './components/about'
import {Load} from './components/load'
import {Main} from './components/main'
import {Person} from './components/person'


function insertAsync(col, data) {
  return new Promise(resolve => db.collection(col).insert(data, resolve))
}

export const db = window.db = (new ForerunnerDB()).db()
const elMain = document.querySelector('main')

render(
  <Load/>,
  elMain
)

Promise.all(ld.values(elMain.dataset).map(d => fetch(d)))
.then(o => Promise.all(o.map(d => d.json())))
.then(([electoralDistricts, mps, parliamentaryPeriods, parties, questions]) =>
  Promise.all([
    insertAsync('electoral_districts', electoralDistricts),
    insertAsync('mps', mps),
    insertAsync('parliamentary_periods', parliamentaryPeriods),
    insertAsync('parties', parties),
    insertAsync('questions', questions)
  ])
)
.then(() => render(
  <Router history={hashHistory}>
    <Route path="/">
      <IndexRoute component={Main}/>
      <Route path="about" component={About}/>
      <Route path="person/:personId" component={Person}/>
    </Route>
  </Router>,
  elMain
))
