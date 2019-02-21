import * as Sentry from "@sentry/browser";

import { applyMiddleware, compose, createStore } from "redux";

import { createBrowserHistory } from "history";
import createRootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware({
  onError: error => Sentry.captureException(error)
});

export const history = createBrowserHistory();
export const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routerMiddleware(history))
  )
);

sagaMiddleware.run(sagas);
