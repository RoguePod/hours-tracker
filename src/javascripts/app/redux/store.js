/* global window */

import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import createHistory from 'history/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';
import { reducer as formReducer } from 'redux-form';
import reducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createHistory();
export const store   = createStore(
  connectRouter(history)(
    combineReducers({
      form: formReducer,
      ...reducers
    })
  ),
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routerMiddleware(history))
  )
);

sagaMiddleware.run(sagas);
