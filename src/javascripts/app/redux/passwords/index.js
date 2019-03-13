import { call, put, select, spawn, takeLatest } from "redux-saga/effects";
import { startFetching, stopFetching } from "javascripts/shared/redux/fetching";

import { addFlash } from "javascripts/shared/redux/flashes";

// Constants

const path = "hours-tracker/app/passwords";

const PASSWORD_UPDATE = `${path}/PASSWORD_UPDATE`;

// Actions

export const updatePassword = (params, actions) => {
  return { actions, params, type: PASSWORD_UPDATE };
};

// Sagas

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
      actions.resetForm();
      actions.setStatus(error.message);
    } else {
      yield put(addFlash("Password has been updated"));
      actions.resetForm();
    }
  } finally {
    actions.setSubmitting(false);
    yield put(stopFetching(PASSWORD_UPDATE));
  }
}

function* watchPasswordUpdate() {
  yield takeLatest(PASSWORD_UPDATE, passwordUpdate);
}

export const sagas = [spawn(watchPasswordUpdate)];
