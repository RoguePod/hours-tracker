import { add, firestore, parseEntry } from 'javascripts/globals';
import {
  call,
  cancelled,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';

import { addFlash } from 'javascripts/shared/redux/flashes';
import { createSelector } from 'reselect';
import { eventChannel } from 'redux-saga';
import moment from 'moment-timezone';
import { selectTimezone } from 'javascripts/app/redux/app';
import update from 'immutability-helper';

// Constants

let channel = null;

const path = 'hours-tracker/app/running';

const ENTRY_START     = `${path}/ENTRY_START`;
const ENTRY_STOP      = `${path}/ENTRY_STOP`;
const ENTRY_SET       = `${path}/ENTRY_SET`;
const ENTRY_UPDATE    = `${path}/ENTRY_UPDATE`;
const ENTRY_SUBSCRIBE = `${path}/ENTRY_SUBSCRIBE`;
const FETCHING_SET    = `${path}/FETCHING_SET`;
const READY           = `${path}/READY`;
const RESET           = `${path}/RESET`;

// Reducer

const initialState = {
  entry: null,
  fetching: null,
  ready: false
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ENTRY_SET:
    return update(state, { entry: { $set: action.entry } });

  case FETCHING_SET:
    return update(state, { fetching: { $set: action.fetching } });

  case READY:
    return update(state, { ready: { $set: true } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const startEntry = (params) => {
  return { params, type: ENTRY_START };
};

export const stopEntry = () => {
  return { type: ENTRY_STOP };
};

export const subscribeEntry = () => {
  return { type: ENTRY_SUBSCRIBE };
};

export const updateEntry = (params, reject) => {
  return { params, reject, type: ENTRY_UPDATE };
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

const setEntry = (entry) => {
  return { entry, type: ENTRY_SET };
};

const setFetching = (fetching) => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* entryStart({ params }) {
  try {
    yield put(setFetching('Starting...'));

    const { entry, user, timezone } = yield select((state) => {
      return {
        entry: state.running.entry,
        timezone: selectTimezone(state),
        user: state.app.user
      };
    });

    const now = moment()
      .utc()
      .valueOf();

    if (entry) {
      entry.snapshot.ref.update({ stoppedAt: now });
    }

    const defaults = {
      clientRef: null,
      createdAt: now,
      description: '',
      projectRef: null,
      startedAt: now,
      stoppedAt: null,
      timezone,
      updatedAt: now,
      userRef: user.snapshot.ref
    };

    const finalParams = { ...defaults, ...params };

    const response = yield call(add, 'entries', finalParams);

    if (response.error) {
      yield put(addFlash(response.error.message, 'red'));
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryStart() {
  yield takeLatest(ENTRY_START, entryStart);
}

function* entryStop() {
  try {
    yield put(setFetching('Stopping...'));

    const { entry } = yield select((state) => {
      return {
        entry: state.running.entry
      };
    });

    if (entry) {
      const now = moment()
        .utc()
        .valueOf();
      entry.snapshot.ref.update({ stoppedAt: now, updatedAt: now });
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryStop() {
  yield takeLatest(ENTRY_STOP, entryStop);
}

function* entryUpdate({ params }) {
  try {
    yield put(setFetching('Updating...'));

    const entry = yield select((state) => state.running.entry);

    if (entry) {
      const updatedAt = moment()
        .utc()
        .valueOf();
      entry.snapshot.ref.update({ ...params, updatedAt });
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryUpdate() {
  yield takeLatest(ENTRY_UPDATE, entryUpdate);
}

function* handleEntrySubscribe({ snapshot }) {
  const isReady = yield select((state) => state.running.ready);

  let entry = null;

  if (snapshot) {
    entry = yield parseEntry(snapshot);
  }

  yield put(setEntry(entry));

  if (!isReady) {
    yield put(ready());
  }
}

function* entrySubscribe() {
  const user = yield select((state) => state.app.user);

  channel = eventChannel((emit) => {
    const unsubscribe = firestore
      .collection('entries')
      .where('stoppedAt', '==', null)
      .where('userRef', '==', user.snapshot.ref)
      .onSnapshot((snapshot) => {
        if (snapshot.size === 0) {
          emit({ snapshot: null });
          return;
        }

        snapshot.forEach((entry) => {
          emit({ snapshot: entry });
        });
      });

    return () => unsubscribe();
  });

  try {
    yield takeEvery(channel, handleEntrySubscribe);
  } finally {
    if (yield cancelled()) {
      channel.close();
      channel = null;
    }
  }
}

function* watchEntrySubscribe() {
  yield takeLatest(ENTRY_SUBSCRIBE, entrySubscribe);
}

export const sagas = [
  fork(watchEntryStart),
  fork(watchEntryStop),
  fork(watchEntryUpdate),
  fork(watchEntrySubscribe)
];

// Selectors

const selectEntry = (state) => state.running.entry;

export const selectRunningEntry = createSelector(
  [selectEntry],
  (entry) => {
    if (entry) {
      return entry;
    }

    return {
      clientRef: null,
      description: '',
      projectRef: null
    };
  }
);
