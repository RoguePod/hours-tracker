import {
  all,
  cancelled,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';

import _find from 'lodash/find';
import _sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';
import { eventChannel } from 'redux-saga';
import { firestore } from 'javascripts/globals';
import update from 'immutability-helper';

// Constants

let channel = null;

const path = 'hours-tracker/app/recents';

const RECENTS_SET       = `${path}/RECENTS_SET`;
const RECENTS_SUBSCRIBE = `${path}/RECENTS_SUBSCRIBE`;
const READY             = `${path}/READY`;
const RESET             = `${path}/RESET`;

// Reducer

const initialState = {
  ready: false,
  recents: []
};

export default (state = initialState, action) => {
  switch (action.type) {
  case RECENTS_SET:
    return update(state, { recents: { $set: action.recents } });

  case READY:
    return update(state, { ready: { $set: true } });

  case RESET:
    if (channel) {
      channel.close();
      channel = null;
    }

    return initialState;

  default:
    return state;
  }
};

// Actions

export const subscribeRecents = () => {
  return { type: RECENTS_SUBSCRIBE };
};

export const reset = () => {
  return { type: RESET };
};

const ready = () => {
  return { type: READY };
};

const setRecents = (recents) => {
  return { recents, type: RECENTS_SET };
};

// Sagas

export function* parseRecent(snapshot) {
  const data = snapshot.data();

  const clients = yield select((state) => state.clients.clients);

  let client = null;

  if (data.clientRef) {
    client = _find(clients, (eClient) => eClient.id === data.clientRef.id);
  }

  let project = null;

  if (client && data.projectRef) {
    project = _find(
      client.projects, (eProject) => eProject.id === data.projectRef.id
    );
  }

  return {
    ...data,
    client,
    id: snapshot.id,
    project,
    snapshot
  };
}

function* handleRecentsSubscribe({ snapshot }) {
  const isReady = yield select((state) => state.recents.ready);
  const recents = yield all(snapshot.docs.map(parseRecent));

  yield put(setRecents(recents));

  if (!isReady) {
    yield put(ready());
  }
}

function* recentsSubscribe() {
  const auth = yield select((state) => state.app.auth);

  channel = eventChannel((emit) => {
    const unsubscribe = firestore
      .collection(`users/${auth.uid}/recents`)
      .onSnapshot((snapshot) => {
        emit({ snapshot });
      });

    return () => unsubscribe();
  });

  try {
    yield takeEvery(channel, handleRecentsSubscribe);
  } finally {
    if (yield cancelled()) {
      channel.close();
      channel = null;
    }
  }
}

function* watchRecentsSubscribe() {
  yield takeLatest(RECENTS_SUBSCRIBE, recentsSubscribe);
}

export const sagas = [fork(watchRecentsSubscribe)];

// Selectors

const selectUser = (state) => state.app.user;
const selectRecents = (state) => state.recents.recents;

export const selectFilteredRecents = createSelector(
  [selectRecents, selectUser],
  (recents, user) => {
    if (!user) {
      return [];
    }

    const { recentProjectsListSize, recentProjectsSort } = user;

    const size   = Number(recentProjectsListSize || 10);
    const sorted = _sortBy(recents, 'startedAt').reverse()
      .slice(0, size);

    if (recentProjectsSort === 'startedAt') {
      return sorted;
    }

    return _sortBy(sorted, recentProjectsSort);
  }
);
