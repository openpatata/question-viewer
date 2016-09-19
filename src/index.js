
import './index.scss'
import './../build/mps.json'
import './../build/questions.json'

import ForerunnerDB from 'forerunnerdb'
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, hashHistory} from 'react-router'

import {Load} from './components/load'
import {Main} from './components/main'
import {Person} from './components/person'


function insertAsync(col, data) {
  return new Promise(resolve => db.collection(col).insert(data, resolve))
}

export const db = (new ForerunnerDB()).db()
const elMain = document.querySelector('main')

render(
  <Load/>,
  elMain
)

Promise.all(
  [fetch(elMain.dataset.mpsUrl), fetch(elMain.dataset.questionsUrl)]
).then(([mps, questions]) =>
  Promise.all([mps.json(), questions.json()])
).then(([mps, questions]) =>
  Promise.all([insertAsync('mps', mps), insertAsync('questions', questions)])
).then(() => render(
  <Router history={hashHistory}>
    <Route path="/">
      <IndexRoute component={Main}/>
      <Route path="person/:personId" component={Person}/>
    </Route>
  </Router>,
  elMain
))
