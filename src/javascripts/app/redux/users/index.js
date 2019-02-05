import {
  all,
  cancelled,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';

import _sortBy from 'lodash/sortBy';
import { eventChannel } from 'redux-saga';
import { firestore } from 'javascripts/globals';
import update from 'immutability-helper';

// Constants

let channel = null;

const path = 'hours-tracker/app/users';

const USERS_SET       = `${path}/USERS_SET`;
const USERS_SUBSCRIBE = `${path}/USERS_SUBSCRIBE`;
const READY           = `${path}/READY`;
const RESET           = `${path}/RESET`;

export const fuseOptions = {
  distance: 100,
  keys: ['name'],
  location: 0,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  threshold: 0.1
};

// Reducer

const initialState = {
  fetching: null,
  ready: false,
  users: []
};

export default (state = initialState, action) => {
  switch (action.type) {
  case USERS_SET:
    return update(state, { users: { $set: action.users } });

  case READY:
    return update(state, { ready: { $set: true } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const subscribeUsers = () => {
  return { type: USERS_SUBSCRIBE };
};

export const reset = () => {
  if (channel) {
    channel.close();
    channel = null;
  }

  return { type: RESET };
};

const ready = () => {
  return { type: READY };
};

const setUsers = (users) => {
  return { type: USERS_SET, users };
};

// Sagas

function parseUser(snapshot) {
  return {
    ...snapshot.data(),
    id: snapshot.id,
    snapshot
  };
}

function* handleUsersSubscribe({ snapshot }) {
  const isReady = yield select((state) => state.users.ready);
  const users = yield all(snapshot.docs.map(parseUser));

  yield put(setUsers(_sortBy(users, 'name')));

  if (!isReady) {
    yield put(ready());
  }
}

function* usersSubscribe() {
  channel = eventChannel((emit) => {
    const unsubscribe = firestore
      .collection('users')
      .onSnapshot((snapshot) => {
        emit({ snapshot });
      });

    return () => unsubscribe();
  });

  try {
    yield takeEvery(channel, handleUsersSubscribe);
  } finally {
    if (yield cancelled()) {
      channel.close();
      channel = null;
    }
  }
}

function* watchUsersSubscribe() {
  yield takeLatest(USERS_SUBSCRIBE, usersSubscribe);
}

export const sagas = [fork(watchUsersSubscribe)];
