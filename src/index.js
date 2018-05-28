import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'materialize-css';
import './../node_modules/materialize-css/dist/css/materialize.css';

import App from './components/App/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

import './assets/styles/index.css';

ReactDOM.render(
  React.createElement(
    Provider, { store },
    React.createElement(App),
  ),
  document.getElementById('root'),
);
registerServiceWorker();
