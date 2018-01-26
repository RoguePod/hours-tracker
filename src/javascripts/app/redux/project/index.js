import { add, getDoc, parseProject, updateRef } from 'javascripts/globals';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { SubmissionError } from 'redux-form';
import { history } from 'javascripts/app/redux/store';
import { subscribeClients } from 'javascripts/app/redux/clients';
import update from 'immutability-helper';

// Constants

const path = 'hours-tracker/app/project';

const PROJECT_SET    = `${path}/PROJECT_SET`;
const PROJECT_GET    = `${path}/PROJECT_GET`;
const PROJECT_UPDATE = `${path}/PROJECT_UPDATE`;
const PROJECT_CREATE = `${path}/PROJECT_CREATE`;
const FETCHING_SET   = `${path}/FETCHING_SET`;
const RESET          = `${path}/RESET`;

// Reducer

const initialState = {
  fetching: null,
  project: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case PROJECT_SET:
    return update(state, { project: { $set: action.project } });

  case FETCHING_SET:
    return update(state, { fetching: { $set: action.fetching } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const getProject = (clientId, id) => {
  return { clientId, id, type: PROJECT_GET };
};

export const createProject = (client, params, resolve, reject) => {
  return { client, params, reject, resolve, type: PROJECT_CREATE };
};

export const updateProject = (params, resolve, reject) => {
  return { params, reject, resolve, type: PROJECT_UPDATE };
};

export const reset = () => {
  return { type: RESET };
};

const setProject = (project) => {
  return { project, type: PROJECT_SET };
};

const setFetching = (fetching) => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* projectGet({ clientId, id }) {
  try {
    yield put(setProject(null));
    yield put(setFetching('Getting Project...'));

    const doc     = yield call(getDoc, `clients/${clientId}/projects/${id}`);
    const project = parseProject(doc);

    yield put(setProject(project));
  } finally {
    yield put(setFetching(null));
  }
}

function* watchProjectGet() {
  yield takeLatest(PROJECT_GET, projectGet);
}

function* projectCreate({ client, params, reject, resolve }) {
  try {
    yield put(setFetching('Creating Project...'));

    const { error } = yield call(add, `clients/${client.id}/projects`, params);

    if (error) {
      reject(new SubmissionError({ _error: error.message }));
    } else {
      yield put(subscribeClients());
      resolve();
      history.push('/clients');
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchProjectCreate() {
  yield takeLatest(PROJECT_CREATE, projectCreate);
}

function* projectUpdate({ params, reject, resolve }) {
  try {
    yield put(setFetching('Updating Project...'));

    const project = yield select((state) => state.project.project);

    const { error } = yield call(
      updateRef, project.snapshot.ref, params
    );

    if (error) {
      reject(new SubmissionError({ _error: error.message }));
    } else {
      yield put(subscribeClients());
      resolve();
      history.push('/clients');
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchProjectUpdate() {
  yield takeLatest(PROJECT_UPDATE, projectUpdate);
}

export const sagas = [
  fork(watchProjectGet),
  fork(watchProjectCreate),
  fork(watchProjectUpdate)
];
