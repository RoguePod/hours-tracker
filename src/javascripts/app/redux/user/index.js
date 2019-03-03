import { call, put, select, spawn, takeLatest } from "redux-saga/effects";
import { firebase, updateRef } from "javascripts/globals";
import { startFetching, stopFetching } from "javascripts/shared/redux/fetching";

import { addFlash } from "javascripts/shared/redux/flashes";
import { userSignOut as appUserSignOut } from "javascripts/app/redux/app";
import update from "immutability-helper";

// Constants

const path = "hours-tracker/app/user";

const USER_SIGN_IN = `${path}/USER_SIGN_IN`;
const USER_SIGN_OUT = `${path}/USER_SIGN_OUT`;
const USER_UPDATE = `${path}/USER_UPDATE`;
const FETCHING_SET = `${path}/FETCHING_SET`;

// Reducer

const initialState = {
  fetching: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_SET:
      return update(state, { fetching: { $set: action.fetching } });

    default:
      return state;
  }
};

// Actions

export const signInUser = (params, actions) => {
  return { actions, params, type: USER_SIGN_IN };
};

export const signOutUser = () => {
  return { type: USER_SIGN_OUT };
};

export const updateUser = (params, actions) => {
  return { actions, params, type: USER_UPDATE };
};

const setFetching = fetching => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* userSignIn({ actions, params: { email, password } }) {
  try {
    yield put(setFetching("Signing In..."));

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        actions.setSubmitting(false);
        actions.setStatus(error.message);
      });
  } finally {
    yield put(setFetching(null));
  }
}

function* watchUserSignIn() {
  yield takeLatest(USER_SIGN_IN, userSignIn);
}

function* userSignOut() {
  try {
    yield put(setFetching("Signing Out..."));

    yield appUserSignOut();
    firebase.auth().signOut();
  } finally {
    yield put(setFetching(null));
  }
}

function* watchUserSignOut() {
  yield takeLatest(USER_SIGN_OUT, userSignOut);
}

export function* userUpdate({ actions, params }) {
  try {
    yield put(startFetching(USER_UPDATE));

    const user = yield select(state => state.app.user);

    const { error } = yield call(updateRef, user.snapshot.ref, params);

    if (error) {
      actions.setStatus(error.message);
    } else {
      yield put(addFlash("Profile has been updated"));
    }
  } finally {
    actions.setSubmitting(false);
    yield put(stopFetching(USER_UPDATE));
  }
}

function* watchUserUpdate() {
  yield takeLatest(USER_UPDATE, userUpdate);
}

export const sagas = [
  spawn(watchUserSignOut),
  spawn(watchUserSignIn),
  spawn(watchUserUpdate)
];
