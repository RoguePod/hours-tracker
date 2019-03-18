import { call, put, select, spawn, takeLatest } from "redux-saga/effects";
import { startFetching, stopFetching } from "javascripts/shared/redux/fetching";

import { addFlash } from "javascripts/shared/redux/flashes";
import { updateRef } from "javascripts/globals";

// Constants

const path = "hours-tracker/app/user";

const USER_UPDATE = `${path}/USER_UPDATE`;

// Actions

export const updateUser = (params, actions) => {
  return { actions, params, type: USER_UPDATE };
};

// Sagas

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

export const sagas = [spawn(watchUserUpdate)];
