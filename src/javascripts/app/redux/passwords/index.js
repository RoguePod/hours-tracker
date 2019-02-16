import { call, fork, put, select, takeLatest } from "redux-saga/effects";
import { startFetching, stopFetching } from "javascripts/shared/redux/fetching";

import { addFlash } from "javascripts/shared/redux/flashes";
import { firebase } from "javascripts/globals";
import { history } from "javascripts/app/redux/store";

// Constants

const path = "hours-tracker/app/passwords";

const PASSWORD_FORGOT = `${path}/PASSWORD_FORGOT`;
const PASSWORD_UPDATE = `${path}/PASSWORD_UPDATE`;

// Actions

export const forgotPassword = (params, actions) => {
  return { actions, params, type: PASSWORD_FORGOT };
};

export const updatePassword = (params, actions) => {
  return { actions, params, type: PASSWORD_UPDATE };
};

// Sagas

const handlePasswordForgot = email => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        resolve({});
      })
      .catch(error => {
        reject(error.message);
      });
  }).then(response => response, error => ({ error }));
};

function* passwordForgot({ actions, params: { email } }) {
  try {
    yield put(startFetching(PASSWORD_FORGOT));

    const { error } = yield call(handlePasswordForgot, email);

    if (error) {
      actions.setStatus(error);
      actions.setSubmitting(false);
    } else {
      yield put(addFlash("Reset Password Instructions sent!"));
      yield call(history.push, "/sign-in");
    }
  } finally {
    yield put(stopFetching(PASSWORD_FORGOT));
  }
}

function* watchPasswordForgot() {
  yield takeLatest(PASSWORD_FORGOT, passwordForgot);
}

const handleUpdatePassword = (auth, password) => {
  return new Promise((resolve, reject) => {
    auth
      .updatePassword(password)
      .then(() => {
        resolve({});
      })
      .catch(error => {
        reject(error);
      });
  }).then(response => response, error => ({ error }));
};

function* passwordUpdate({ actions, params }) {
  try {
    yield put(startFetching(PASSWORD_UPDATE));

    const { password } = params;
    const auth = yield select(state => state.app.auth);

    const { error } = yield call(handleUpdatePassword, auth, password);

    if (error) {
      actions.setSubmitting(false);
      actions.resetForm();
      actions.setStatus(error.message);
    } else {
      yield put(addFlash("Password has been updated"));
      actions.resetForm();
    }
  } finally {
    yield put(stopFetching(PASSWORD_UPDATE));
  }
}

function* watchPasswordUpdate() {
  yield takeLatest(PASSWORD_UPDATE, passwordUpdate);
}

export const sagas = [fork(watchPasswordForgot), fork(watchPasswordUpdate)];
