import { call, put, select, spawn, takeLatest } from "redux-saga/effects";
import { firebase, updateRef } from "javascripts/globals";
import { startFetching, stopFetching } from "javascripts/shared/redux/fetching";

import { addFlash } from "javascripts/shared/redux/flashes";
import { userSignOut as appUserSignOut } from "javascripts/app/redux/app";

// Constants

const path = "hours-tracker/app/user";

const USER_SIGN_OUT = `${path}/USER_SIGN_OUT`;
const USER_UPDATE = `${path}/USER_UPDATE`;

// Actions

export const signOutUser = () => {
  return { type: USER_SIGN_OUT };
};

export const updateUser = (params, actions) => {
  return { actions, params, type: USER_UPDATE };
};

// Sagas

function* userSignOut() {
  yield appUserSignOut();
  firebase.auth().signOut();
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

export const sagas = [spawn(watchUserSignOut), spawn(watchUserUpdate)];
