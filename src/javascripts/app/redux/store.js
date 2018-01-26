import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';

import createHistory from 'history/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';
import { reducer as formReducer } from 'redux-form';
import reducers from './reducers';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();
/* eslint-disable no-undef */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable no-undef */

export const history = createHistory();
export const store   = createStore(
  combineReducers({
    form: formReducer,
    router: routerReducer,
    ...reducers
  }),
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routerMiddleware(history))
  )
);

sagaMiddleware.run(sagas);
