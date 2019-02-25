/* eslint-disable max-lines */

/* global document, localStorage */

import { call, fork, put, select, takeLatest } from "redux-saga/effects";

import { addFlash } from "javascripts/shared/redux/flashes";
import { createSelector } from "reselect";
import { history } from "javascripts/app/redux/store";
import { request } from "javascripts/globals";
import { reset as resetClients } from "javascripts/app/redux/clients";
import { reset as resetRecents } from "javascripts/app/redux/recents";
import { reset as resetRunning } from "javascripts/app/redux/running";
import { reset as resetUsers } from "javascripts/app/redux/users";
import update from "immutability-helper";

// Constants

const path = "hours-tracker/app";

const APP_LOAD = `${path}/APP_LOAD`;
const READY = `${path}/READY`;
const REDIRECT_SET = `${path}/REDIRECT_SET`;
const USER_REDIRECT = `${path}/USER_REDIRECT`;
const USER_SET = `${path}/USER_SET`;
const USER_SIGN_IN = `${path}/USER_SIGN_IN`;
const USER_SIGN_OUT = `${path}/USER_SIGN_OUT`;
const WINDOW_UPDATE = `${path}/WINDOW_UPDATE`;

// Reducer

const initialState = {
  height: document.documentElement.clientHeight,
  ready: false,
  redirect: null,
  token: null,
  user: null,
  width: document.documentElement.clientWidth
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_SET:
      return update(state, { user: { $set: action.user } });

    case READY:
      return update(state, { ready: { $set: true } });

    case REDIRECT_SET:
      return update(state, { redirect: { $set: action.redirect } });

    case USER_REDIRECT:
      return update(state, {
        open: { $set: "signIn" },
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

export const loadApp = () => {
  return { type: APP_LOAD };
};

export const redirectUser = (redirect, message) => {
  return { message, redirect, type: USER_REDIRECT };
};

export const setRedirect = redirect => {
  return { redirect, type: REDIRECT_SET };
};

export const updateWindow = (width, height) => {
  return { height, type: WINDOW_UPDATE, width };
};

export const signInUser = (user, token) => {
  return { user, token, type: USER_SIGN_IN };
};

const setUser = user => {
  return { type: USER_SET, user };
};

const ready = () => {
  return { type: READY };
};

// Sagas

export function* userSignIn(user, token) {
  yield put(setUser(user));

  localStorage.setItem("token", token);

  // yield put(subscribeUser(auth));
  // yield put(subscribeClients());

  const redirect = yield select(state => state.app.redirect);

  if (redirect) {
    yield call(history.push, redirect);
    yield put(setRedirect(null));
  } else {
    yield call(history.push, "/");
  }
}

function* watchUserSignIn() {
  yield takeLatest(USER_SIGN_IN, userSignIn);
}

function* userSignOut() {
  yield put(resetRunning());
  yield put(resetRecents());
  yield put(resetUsers());
  yield put(resetClients());

  // if (userChannel) {
  //   userChannel.close();
  //   userChannel = null;
  // }

  // yield put(setAuth(null));

  yield call(history.push, "/sign-in");
}

function* watchUserSignOut() {
  yield takeLatest(USER_SIGN_OUT, userSignOut);
}

function* appLoad() {
  const token = localStorage.getItem("token");

  if (typeof token === "string") {
    const response = yield call(request, "/user", "GET");

    if (response.error) {
      localStorage.removeItem("token");

      // yield put(connectCable(null));
    } else if (response.user) {
      yield put(setUser(response.user));

      // yield put(connectCable(token));
    }
  } else {
    // yield put(connectCable(null));
  }

  yield put(ready());
}

function* watchAppLoad() {
  yield takeLatest(APP_LOAD, appLoad);
}

function* userRedirect({ message }) {
  if (message) {
    yield put(addFlash(message, "red"));
  }
}

function* watchUserRedirect() {
  yield takeLatest(USER_REDIRECT, userRedirect);
}

export const sagas = [
  fork(watchAppLoad),
  fork(watchUserRedirect),
  fork(watchUserSignIn),
  fork(watchUserSignOut)
];

// Selectors

const selectUser = state => state.app.user;

export const selectTimezone = createSelector(
  [selectUser],
  user => {
    if (!user) {
      return "America/Denver";
    }

    return user.timezone || "America/Denver";
  }
);

export const selectAdmin = createSelector(
  [selectUser],
  user => user && user.role === "Admin"
);
