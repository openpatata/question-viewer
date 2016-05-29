
import './index.scss';
import './../build/questions.json';

import ForerunnerDB from 'forerunnerdb';

import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import {Load} from './components/load.js';
import {Main} from './components/main.js';


const db = window.db = (new ForerunnerDB()).db(),
  col = db.collection('questions'), main = document.querySelector('main');
ReactDOM.render(<Load/>, main) && fetch(main.dataset.questionsUrl)
  .then(res => res.json()).catch(e => console.error(e))
  .then(json => col.insert(json, () => ReactDOM.render(<Main col={col}/>, main)));
