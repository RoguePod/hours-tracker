import * as Sentry from '@sentry/browser';

import { applyMiddleware, compose, createStore } from 'redux';

import createRootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import history from 'javascripts/history';
import { routerMiddleware } from 'connected-react-router';
import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware({
  onError: (error) => {
    if (process.env.ENV === 'development') {
      /* eslint-disable no-console */
      console.error(error);
      /* eslint-enable no-console */
    } else {
      Sentry.captureException(error);
    }
  }
});

const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routerMiddleware(history))
  )
);

sagaMiddleware.run(sagas);

export default store;
