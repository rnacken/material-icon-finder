import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

import allReducers from './reducers';


const initialState = {}

const middleWare = [thunk];

const store = createStore(
    allReducers,
    initialState,
    composeWithDevTools(
        applyMiddleware(...middleWare),
    )
);
export default store;
