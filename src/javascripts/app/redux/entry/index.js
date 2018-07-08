import { SubmissionError, reset as resetForm } from 'redux-form';
import {
  add, batchCommit, deleteDoc, firestore, getDoc, parseEntry, updateRef
} from 'javascripts/globals';
import {
  call, fork, put, select, takeLatest
} from 'redux-saga/effects';

import { addFlash } from 'javascripts/shared/redux/flashes';
import { history } from 'javascripts/app/redux/store';
import moment from 'moment';
import { selectTimezone } from 'javascripts/app/redux/app';
import update from 'immutability-helper';

// Constants

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

export const createEntry = (params, resolve, reject) => {
  return { params, reject, resolve, type: ENTRY_CREATE };
};

export const updateEntry = (params, resolve, reject) => {
  return { params, reject, resolve, type: ENTRY_UPDATE };
};

export const splitEntry = (entries, resolve, reject) => {
  return { entries, reject, resolve, type: ENTRY_SPLIT };
};

export const destroyEntry = (id) => {
  return { id, type: ENTRY_DESTROY };
};

export const reset = () => {
  return { type: RESET };
};

const setEntry = (entry) => {
  return { entry, type: ENTRY_SET };
};

const setFetching = (fetching) => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* entryGet({ id }) {
  try {
    yield put(setEntry(null));
    yield put(setFetching('Getting Entry...'));

    const doc   = yield call(getDoc, `entries/${id}`);
    const entry = yield parseEntry(doc);

    yield put(setEntry(entry));
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryGet() {
  yield takeLatest(ENTRY_GET, entryGet);
}

function* entryCreate({ params, reject, resolve }) {
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
      reject(new SubmissionError({ _error: error.message }));
    } else {
      yield put(resetForm('EntryNewForm'));
      yield put(addFlash('Entry has saved.'));
      resolve();
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryCreate() {
  yield takeLatest(ENTRY_CREATE, entryCreate);
}

function* entryUpdate({ params, reject, resolve }) {
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
      reject(new SubmissionError({ _error: error.message }));
    } else {
      yield put(addFlash('Entry has saved.'));
      resolve();
      history.push('/entries');
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryUpdate() {
  yield takeLatest(ENTRY_UPDATE, entryUpdate);
}

function* entrySplit({ entries, reject, resolve }) {
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
      reject(new SubmissionError({ _error: error.message }));
    } else {
      yield put(addFlash('Entry has been split'));
      resolve();
      history.push('/entries');
    }
  } finally {
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
