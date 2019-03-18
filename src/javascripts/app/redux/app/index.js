/* eslint-disable max-lines */

/* global document, localStorage */

import { call, put, select, spawn, takeLatest } from "redux-saga/effects";

import { addFlash } from "javascripts/shared/redux/flashes";
import { createSelector } from "reselect";
import { history } from "javascripts/app/redux/store";
import update from "immutability-helper";

// Constants

const path = "hours-tracker/app";

const APP_LOAD = `${path}/APP_LOAD`;
const REDIRECT_SET = `${path}/REDIRECT_SET`;
const USER_REDIRECT = `${path}/USER_REDIRECT`;
const TOKEN_SET = `${path}/TOKEN_SET`;
const USER_SIGN_IN = `${path}/USER_SIGN_IN`;
const USER_SIGN_OUT = `${path}/USER_SIGN_OUT`;
const WINDOW_UPDATE = `${path}/WINDOW_UPDATE`;

// Reducer

const initialState = {
  height: document.documentElement.clientHeight,
  redirect: null,
  token: localStorage.getItem("token"),
  width: document.documentElement.clientWidth
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOKEN_SET:
      return update(state, { token: { $set: action.token } });

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

export const signInUser = token => {
  return { token, type: USER_SIGN_IN };
};

export const signOutUser = () => {
  return { type: USER_SIGN_OUT };
};

const setToken = token => {
  return { token, type: TOKEN_SET };
};

// Sagas

function* userSignIn({ token }) {
  yield put(setToken(token));
  localStorage.setItem("token", token);

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

export function* userSignOut() {
  yield put(setToken(null));
  localStorage.removeItem("token");

  yield call(history.push, "/sign-in");
}

function* watchUserSignOut() {
  yield takeLatest(USER_SIGN_OUT, userSignOut);
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
  spawn(watchUserRedirect),
  spawn(watchUserSignIn),
  spawn(watchUserSignOut)
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
