import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'materialize-css';
import './../node_modules/materialize-css/dist/css/materialize.css';

import App from './components/App/App';
//import registerServiceWorker from './registerServiceWorker';
import store from './store';

import './assets/styles/index.css';

ReactDOM.render(
    <Provider store={store}><App /></Provider>
    , document.getElementById('root'));
//registerServiceWorker();
