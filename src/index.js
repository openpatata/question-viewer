
import './index.scss';

import ForerunnerDB from 'forerunnerdb';

import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import {Load} from './components/load.js';
import {Main} from './components/main.js';


const db = window.db = (new ForerunnerDB()).db();

ReactDOM.render(<Load/>, document.querySelector('main'));
fetch('questions.json')
  .then(res => res.json()).catch(e => console.error(e))
  .then(json => db.collection('questions').insert(json, () =>
    ReactDOM.render(
      <Main db={db.collection('questions')}/>, document.querySelector('main')
    )));
