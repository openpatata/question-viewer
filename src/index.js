
import './index.scss'
import './../build/mps.json'
import './../build/questions.json'

import ForerunnerDB from 'forerunnerdb'
import React from 'react'
import {render} from 'react-dom'
import {hashHistory} from 'react-router'

import {Main} from './components/main'


export const db = window.db = (new ForerunnerDB()).db()
const elMain = document.querySelector('main')

render(
  <Main history={hashHistory}
        mpsUrl={elMain.dataset.mpsUrl}
        questionsUrl={elMain.dataset.questionsUrl}/>,
  elMain
)
