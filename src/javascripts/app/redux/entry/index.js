/* eslint-disable max-lines */

import {
  add,
  batchCommit,
  deleteDoc,
  firestore,
  parseEntry,
  updateRef
} from 'javascripts/globals';
import {
  call,
  cancelled,
  fork,
  put,
  select,
  takeLatest
} from 'redux-saga/effects';

import { addFlash } from 'javascripts/shared/redux/flashes';
import { createSelector } from 'reselect';
import { eventChannel } from 'redux-saga';
import { history } from 'javascripts/app/redux/store';
import moment from 'moment';
import { selectTimezone } from 'javascripts/app/redux/app';
import update from 'immutability-helper';

// Selectors

const selectEntry = (state) => state.entry.entry;

export const selectEntryForForm = createSelector(
  [selectEntry, selectTimezone],
  (entry, timezone) => {
    if (!entry) {
      return {
        description: '',
        startedAt: null,
        startedAtText: '',
        stoppedAt: null,
        stoppedAtText: '',
        timezone
      };
    }

    const startedAtText = moment.tz(entry.startedAt, entry.timezone)
      .format('MM/DD/YYYY hh:mm A z');

    let stoppedAtText = null;

    if (entry.stoppedAt) {
      stoppedAtText = moment.tz(entry.stoppedAt, entry.timezone)
        .format('MM/DD/YYYY hh:mm A z');
    }

    return {
      clientRef: entry.clientRef,
      description: entry.description,
      projectRef: entry.projectRef,
      startedAt: entry.startedAt,
      startedAtText,
      stoppedAt: entry.stoppedAt,
      stoppedAtText,
      timezone: entry.timezone || timezone
    };
  }
);

// Constants

let channel = null;

const path = 'hours-tracker/app/entry';

const ENTRY_SET     = `${path}/ENTRY_SET`;
const ENTRY_GET     = `${path}/ENTRY_GET`;
const ENTRY_UPDATE  = `${path}/ENTRY_UPDATE`;
const ENTRY_SPLIT   = `${path}/ENTRY_SPLIT`;
const ENTRY_CREATE  = `${path}/ENTRY_CREATE`;
const ENTRY_DESTROY = `${path}/ENTRY_DESTROY`;
const FETCHING_SET  = `${path}/FETCHING_SET`;
const RESET         = `${path}/RESET`;

// Reducer

const initialState = {
  entry: null,
  fetching: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ENTRY_SET:
    return update(state, { entry: { $set: action.entry } });

  case FETCHING_SET:
    return update(state, { fetching: { $set: action.fetching } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const getEntry = (id) => {
  return { id, type: ENTRY_GET };
};

export const createEntry = (params, actions) => {
  return { actions, params, type: ENTRY_CREATE };
};

export const updateEntry = (params, actions) => {
  return { actions, params, type: ENTRY_UPDATE };
};

export const splitEntry = (entries, actions) => {
  return { actions, entries, type: ENTRY_SPLIT };
};

export const destroyEntry = (id) => {
  return { id, type: ENTRY_DESTROY };
};

export const reset = () => {
  if (channel) {
    channel.close();
    channel = null;
  }

  return { type: RESET };
};

const setEntry = (entry) => {
  return { entry, type: ENTRY_SET };
};

const setFetching = (fetching) => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* handleEntrySubscribe({ snapshot }) {
  let entry = null;

  if (snapshot) {
    entry = yield parseEntry(snapshot);
  }

  yield put(setEntry(entry));
  yield put(setFetching(null));
}

function* entryGet({ id }) {
  yield put(setEntry(null));
  yield put(setFetching('Getting Entry...'));

  if (channel) {
    channel.close();
  }

  channel = eventChannel((emit) => {
    const unsubscribe = firestore
      .doc(`entries/${id}`)
      .onSnapshot((snapshot) => {
        emit({ snapshot });
      });

    return () => unsubscribe();
  });

  try {
    yield takeLatest(channel, handleEntrySubscribe);
  } finally {
    if (yield cancelled()) {
      channel.close();
      channel = null;
    }
  }
}

function* watchEntryGet() {
  yield takeLatest(ENTRY_GET, entryGet);
}

function* entryCreate({ actions, params }) {
  try {
    yield put(setFetching('Creating Entry...'));

    const { timezone, user } = yield select((state) => {
      return {
        timezone: selectTimezone(state),
        user: state.app.user
      };
    });

    const now = moment()
      .utc()
      .valueOf();

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

    const { error } = yield call(add, 'entries', { ...defaults, ...params });

    if (error) {
      actions.setStatus(error.message);
    } else {
      yield put(addFlash('Entry has been created.'));

      if (history.action === 'POP') {
        yield call(history.push, '/entries');
      } else {
        yield call(history.goBack);
      }
    }
  } finally {
    actions.setSubmitting(false);
    yield put(setFetching(null));
  }
}

function* watchEntryCreate() {
  yield takeLatest(ENTRY_CREATE, entryCreate);
}

function* entryUpdate({ actions, params }) {
  try {
    yield put(setFetching('Updating Entry...'));

    const entry     = yield select((state) => state.entry.entry);
    const updatedAt = moment()
      .utc()
      .valueOf();

    const { error } = yield call(
      updateRef, entry.snapshot.ref, { ...params, updatedAt }
    );

    if (error) {
      actions.setStatus(error.message);
    } else {
      yield put(addFlash('Entry has been updated.'));

      if (history.action === 'POP') {
        yield call(history.push, '/entries');
      } else {
        yield call(history.goBack);
      }
    }
  } finally {
    actions.setSubmitting(false);
    yield put(setFetching(null));
  }
}

function* watchEntryUpdate() {
  yield takeLatest(ENTRY_UPDATE, entryUpdate);
}

function* entrySplit({ actions, entries }) {
  try {
    yield put(setFetching('Splitting Entry...'));

    const { entry, timezone, user } = yield select((state) => {
      return {
        entry: state.entry.entry,
        timezone: selectTimezone(state),
        user: state.app.user
      };
    });

    const now = moment()
      .utc()
      .valueOf();

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

    const batch = firestore.batch();

    entry.snapshot.ref.update({ ...defaults, ...entries[0] });

    entries.slice(1).forEach((newEntry) => {
      const data = { ...defaults, ...newEntry };
      firestore.collection('entries').add(data);
    });

    const { error } = yield call(batchCommit, batch);

    if (error) {
      actions.setStatus(error.message);
    } else {
      yield put(addFlash('Entry has been split'));
      history.push('/entries');
    }
  } finally {
    actions.setSubmitting(false);
    yield put(setFetching(null));
  }
}

function* watchEntrySplit() {
  yield takeLatest(ENTRY_SPLIT, entrySplit);
}

function* entryDestroy({ id }) {
  try {
    yield put(setFetching('Deleting Entry...'));

    const { error } = yield call(deleteDoc, `entries/${id}`);

    if (error) {
      yield put(addFlash(error.message, 'red'));
    } else {
      yield put(addFlash('Entry has been removed'));
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryDestroy() {
  yield takeLatest(ENTRY_DESTROY, entryDestroy);
}

export const sagas = [
  fork(watchEntryGet),
  fork(watchEntryCreate),
  fork(watchEntryUpdate),
  fork(watchEntrySplit),
  fork(watchEntryDestroy)
];
