import { COOKIE_PATHS, isBlank } from 'javascripts/globals';
import { call, put, select, spawn, takeLatest } from 'redux-saga/effects';

import Cookies from 'js-cookie';
import GraphQLClient from 'javascripts/apollo';
import { addFlash } from 'javascripts/shared/redux/flashes';
// import { createSelector } from 'reselect';
import history from 'javascripts/history';
import update from 'immutability-helper';

// Constants

const path = 'hours-tracker/shared/app';

const APOLLO_CLIENT_SET = `${path}/APOLLO_CLIENT_SET`;
const APP_LOAD = `${path}/APP_LOAD`;
const REDIRECT_SET = `${path}/REDIRECT_SET`;
const TOKEN_SET = `${path}/TOKEN_SET`;
const USER_REDIRECT = `${path}/USER_REDIRECT`;
const USER_SET = `${path}/USER_SET`;
const USER_SIGN_IN = `${path}/USER_SIGN_IN`;
const USER_SIGN_OUT = `${path}/USER_SIGN_OUT`;
const WINDOW_UPDATE = `${path}/WINDOW_UPDATE`;

// Cookies.remove(COOKIE_PATHS.token);
const initialToken = Cookies.get(COOKIE_PATHS.token);

// Reducer

const initialState = {
  apolloClient: new GraphQLClient(initialToken),
  height: document.documentElement.clientHeight,
  redirect: null,
  timezone: null,
  token: initialToken,
  user: null,
  width: document.documentElement.clientWidth
};

export default (state = initialState, action) => {
  switch (action.type) {
    case APOLLO_CLIENT_SET:
      return update(state, { apolloClient: { $set: action.apolloClient } });

    case TOKEN_SET:
      return update(state, { token: { $set: action.token } });

    case REDIRECT_SET:
      return update(state, { redirect: { $set: action.redirect } });

    case USER_SET:
      return update(state, { user: { $set: action.user } });

    case USER_REDIRECT:
      return update(state, {
        open: { $set: 'signIn' },
        redirect: { $set: action.redirect }
      });

    case WINDOW_UPDATE:
      return update(state, {
        height: { $set: action.height },
        width: { $set: action.width }
      });

    default:
      return state;
  }
};

// Actions

export const loadApp = () => ({ type: APP_LOAD });
export const setRedirect = (redirect) => ({ redirect, type: REDIRECT_SET });
export const setUser = (user) => ({ user, type: USER_SET });
export const signInUser = (token) => ({ token, type: USER_SIGN_IN });
export const signOutUser = () => ({ type: USER_SIGN_OUT });

export const redirectUser = (redirect, message) => {
  return { message, redirect, type: USER_REDIRECT };
};

export const setApolloClient = (apolloClient) => {
  return { apolloClient, type: APOLLO_CLIENT_SET };
};

export const updateWindow = (width, height) => {
  return { height, type: WINDOW_UPDATE, width };
};

export const setToken = (token) => {
  if (!isBlank(token)) {
    Cookies.set(COOKIE_PATHS.token, token, {
      secure: process.env.ENV === 'production'
    });
  } else {
    Cookies.remove(COOKIE_PATHS.token);
  }
  return { token, type: TOKEN_SET };
};

// Sagas

function* userSignIn({ token }) {
  const apolloClient = yield select((state) => state.app.apolloClient);
  apolloClient.close();

  yield put(setToken(token));

  const newApolloClient = new GraphQLClient(token);

  yield put(setApolloClient(newApolloClient));
  const redirect = yield select((state) => state.app.redirect);

  if (redirect) {
    yield call(history.push, redirect);
    yield put(setRedirect(null));
  } else {
    yield call(history.push, '/');
  }
}

function* watchUserSignIn() {
  yield takeLatest(USER_SIGN_IN, userSignIn);
}

export function* userSignOut() {
  yield put(setToken(null));

  window.location = '/';
}

function* watchUserSignOut() {
  yield takeLatest(USER_SIGN_OUT, userSignOut);
}

function* userRedirect({ message }) {
  if (message) {
    yield put(addFlash(message, { color: 'red' }));
  }
}

function* watchUserRedirect() {
  yield takeLatest(USER_REDIRECT, userRedirect);
}

export const sagas = [
  spawn(watchUserRedirect),
  spawn(watchUserSignIn),
  spawn(watchUserSignOut)
];

// Selectors

export const selectTimezone = (state) =>
  state.app.timezone || 'America/Chicago';

export const selectAdmin = (_state) => false;
