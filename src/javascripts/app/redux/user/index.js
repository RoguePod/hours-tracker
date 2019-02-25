import { call, fork, put, select, takeLatest } from "redux-saga/effects";
import { firebase, request, updateRef } from "javascripts/globals";
import { startFetching, stopFetching } from "javascripts/shared/redux/fetching";

import { addFlash } from "javascripts/shared/redux/flashes";
import { signInUser as appSignInUser } from "javascripts/app/redux/app";

// Constants

const path = "hours-tracker/app/user";

const USER_SIGN_IN = `${path}/USER_SIGN_IN`;
const USER_SIGN_OUT = `${path}/USER_SIGN_OUT`;
const USER_UPDATE = `${path}/USER_UPDATE`;

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

// Sagas

function* userSignIn({ actions, params }) {
  const response = yield call(request, "/v1/session", "POST", {
    session: params
  });

  if (response.error) {
    actions.setStatus("Invalid Credentials");
    actions.setSubmitting(false);
  } else {
    yield put(appSignInUser(response.user, response.token));
    yield put(addFlash("Sign In Successful!"));
  }
}

function* watchUserSignIn() {
  yield takeLatest(USER_SIGN_IN, userSignIn);
}

function* userSignOut() {
  yield firebase.auth().signOut();
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
      actions.setSubmitting(false);
    } else {
      yield put(addFlash("Profile has been updated"));
    }
  } finally {
    yield put(stopFetching(USER_UPDATE));
  }
}

function* watchUserUpdate() {
  yield takeLatest(USER_UPDATE, userUpdate);
}

export const sagas = [
  fork(watchUserSignOut),
  fork(watchUserSignIn),
  fork(watchUserUpdate)
];
