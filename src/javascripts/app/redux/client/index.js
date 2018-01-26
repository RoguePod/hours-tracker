import { add, getDoc, parseClient, updateRef } from 'javascripts/globals';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { SubmissionError } from 'redux-form';
import { history } from 'javascripts/app/redux/store';
import update from 'immutability-helper';

// Constants

const path = 'hours-tracker/app/client';

const CLIENT_SET    = `${path}/CLIENT_SET`;
const CLIENT_GET    = `${path}/CLIENT_GET`;
const CLIENT_UPDATE = `${path}/CLIENT_UPDATE`;
const CLIENT_CREATE = `${path}/CLIENT_CREATE`;
const FETCHING_SET  = `${path}/FETCHING_SET`;
const RESET         = `${path}/RESET`;

// Reducer

const initialState = {
  client: null,
  fetching: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case CLIENT_SET:
    return update(state, { client: { $set: action.client } });

  case FETCHING_SET:
    return update(state, { fetching: { $set: action.fetching } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const getClient = (id) => {
  return { id, type: CLIENT_GET };
};

export const createClient = (params, resolve, reject) => {
  return { params, reject, resolve, type: CLIENT_CREATE };
};

export const updateClient = (params, resolve, reject) => {
  return { params, reject, resolve, type: CLIENT_UPDATE };
};

export const reset = () => {
  return { type: RESET };
};

const setClient = (client) => {
  return { client, type: CLIENT_SET };
};

const setFetching = (fetching) => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* clientGet({ id }) {
  try {
    yield put(setClient(null));
    yield put(setFetching('Getting Client...'));

    const doc   = yield call(getDoc, `clients/${id}`);
    const client = yield parseClient(doc);

    yield put(setClient(client));
  } finally {
    yield put(setFetching(null));
  }
}

function* watchClientGet() {
  yield takeLatest(CLIENT_GET, clientGet);
}

function* clientCreate({ params, reject, resolve }) {
  try {
    yield put(setFetching('Creating Client...'));

    const { error } = yield call(add, 'clients', params);

    if (error) {
      reject(new SubmissionError({ _error: error.message }));
    } else {
      resolve();
      history.push('/clients');
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchClientCreate() {
  yield takeLatest(CLIENT_CREATE, clientCreate);
}

function* clientUpdate({ params, reject, resolve }) {
  try {
    yield put(setFetching('Updating Client...'));

    const client = yield select((state) => state.client.client);

    const { error } = yield call(
      updateRef, client.snapshot.ref, params
    );

    if (error) {
      reject(new SubmissionError({ _error: error.message }));
    } else {
      resolve();
      history.push('/clients');
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchClientUpdate() {
  yield takeLatest(CLIENT_UPDATE, clientUpdate);
}

export const sagas = [
  fork(watchClientGet),
  fork(watchClientCreate),
  fork(watchClientUpdate)
];
