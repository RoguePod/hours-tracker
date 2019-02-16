/* eslint-disable max-lines */

/* global document */

import {
  call,
  cancelled,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { firebase, firestore } from "javascripts/globals";
import {
  reset as resetClients,
  subscribeClients
} from "javascripts/app/redux/clients";
import {
  reset as resetRunning,
  subscribeEntry
} from "javascripts/app/redux/running";
import {
  reset as resetUsers,
  subscribeUsers
} from "javascripts/app/redux/users";

import { addFlash } from "javascripts/shared/redux/flashes";
import { createSelector } from "reselect";
import { eventChannel } from "redux-saga";
import { history } from "javascripts/app/redux/store";
import { reset as resetRecents } from "javascripts/app/redux/recents";
import update from "immutability-helper";

// Constants

let authChannel = null;
let userChannel = null;
const path = "hours-tracker/app";

const APP_LOAD = `${path}/APP_LOAD`;
const USER_SET = `${path}/USER_SET`;
const AUTH_SET = `${path}/AUTH_SET`;
const READY = `${path}/READY`;
const USER_REDIRECT = `${path}/USER_REDIRECT`;
const REDIRECT_SET = `${path}/REDIRECT_SET`;
const WINDOW_UPDATE = `${path}/WINDOW_UPDATE`;
const AUTH_SUBSCRIBE = `${path}/AUTH_SUBSCRIBE`;
const USER_SUBSCRIBE = `${path}/USER_SUBSCRIBE`;

// Reducer

const initialState = {
  auth: null,
  height: document.documentElement.clientHeight,
  ready: false,
  redirect: null,
  token: null,
  user: null,
  width: document.documentElement.clientWidth
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET:
      return update(state, { auth: { $set: action.auth } });

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

const setUser = user => {
  return { type: USER_SET, user };
};

const setAuth = auth => {
  return { auth, type: AUTH_SET };
};

const subscribeAuth = () => {
  return { type: AUTH_SUBSCRIBE };
};

const subscribeUser = auth => {
  return { auth, type: USER_SUBSCRIBE };
};

const ready = () => {
  return { type: READY };
};

// Sagas

function* handleUserSubscribe({ snapshot }) {
  const current = yield select(state => {
    return {
      auth: state.app.auth,
      ready: state.app.ready
    };
  });

  if (current.auth) {
    const user = {
      ...snapshot.data(),
      id: snapshot.id,
      snapshot
    };

    if (user.role === "Admin") {
      yield put(subscribeUsers());
    }
    yield put(setUser(user));
    yield put(subscribeEntry());
  }

  if (!current.ready) {
    yield put(ready());
  }
}

function* userSubscribe({ auth }) {
  userChannel = eventChannel(emit => {
    const unsubscribe = firestore
      .doc(`users/${auth.uid}`)
      .onSnapshot(snapshot => {
        emit({ snapshot });
      });

    return () => unsubscribe();
  });

  try {
    yield takeEvery(userChannel, handleUserSubscribe);
  } finally {
    if (yield cancelled()) {
      userChannel.close();
    }
  }
}

function* watchUserSubscribe() {
  yield takeLatest(USER_SUBSCRIBE, userSubscribe);
}

function* userSignIn(auth, initial) {
  yield put(setAuth(auth));

  yield put(subscribeUser(auth));
  yield put(subscribeClients());

  if (initial) {
    return;
  }

  const redirect = yield select(state => state.app.redirect);

  if (redirect) {
    yield call(history.push, redirect);
    yield put(setRedirect(null));
  } else {
    yield call(history.push, "/");
  }
}

function* userSignOut() {
  yield put(resetRunning());
  yield put(resetRecents());
  yield put(resetUsers());
  yield put(resetClients());

  if (userChannel) {
    userChannel.close();
    userChannel = null;
  }

  yield put(setAuth(null));

  yield call(history.push, "/sign-in");
}

function* handleAuthSubscribe({ auth }) {
  const current = yield select(state => {
    return {
      auth: state.app.auth,
      ready: state.app.ready
    };
  });

  if (current.ready) {
    if (current.auth && !auth) {
      yield userSignOut();
    } else if (!current.auth && auth) {
      yield userSignIn(auth, false);
    }
  } else if (auth) {
    yield userSignIn(auth, true);
  } else {
    yield put(ready());
  }
}

function* authSubscribe() {
  authChannel = eventChannel(emit => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(auth => emit({ auth }), () => emit({ user: null }));

    return unsubscribe;
  });

  try {
    yield takeEvery(authChannel, handleAuthSubscribe);
  } finally {
    if (yield cancelled()) {
      userChannel.close();
    }
  }
}

function* watchAuthSubscribe() {
  yield takeLatest(AUTH_SUBSCRIBE, authSubscribe);
}

function* appLoad() {
  yield put(subscribeAuth());
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
  fork(watchAuthSubscribe),
  fork(watchAppLoad),
  fork(watchUserRedirect),
  fork(watchUserSubscribe)
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
