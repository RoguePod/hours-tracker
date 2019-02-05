import { add, updateRef } from 'javascripts/globals';
import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { addFlash } from 'javascripts/shared/redux/flashes';
import { history } from 'javascripts/app/redux/store';
import { subscribeClients } from 'javascripts/app/redux/clients';
import update from 'immutability-helper';

// Constants

const path = 'hours-tracker/app/projects';

const PROJECT_UPDATE = `${path}/PROJECT_UPDATE`;
const PROJECT_CREATE = `${path}/PROJECT_CREATE`;
const FETCHING_SET   = `${path}/FETCHING_SET`;
const RESET          = `${path}/RESET`;

// Reducer

const initialState = {
  fetching: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case FETCHING_SET:
    return update(state, { fetching: { $set: action.fetching } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const createProject = (client, params, actions) => {
  return { actions, client, params, type: PROJECT_CREATE };
};

export const updateProject = (project, params, actions) => {
  return { actions, params, project, type: PROJECT_UPDATE };
};

export const reset = () => {
  return { type: RESET };
};

const setFetching = (fetching) => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* projectCreate({ actions, client, params }) {
  try {
    yield put(setFetching('Creating Project...'));

    const { error } = yield call(add, `clients/${client.id}/projects`, params);

    if (error) {
      actions.setStatus(error.message);
    } else {
      yield put(addFlash('Project has been created.'));
      yield put(subscribeClients());

      if (history.action === 'POP') {
        yield call(history.push, '/clients');
      } else {
        yield call(history.goBack);
      }
    }
  } finally {
    actions.setSubmitting(false);
    yield put(setFetching(null));
  }
}

function* watchProjectCreate() {
  yield takeLatest(PROJECT_CREATE, projectCreate);
}

function* projectUpdate({ actions, params, project }) {
  try {
    yield put(setFetching('Updating Project...'));

    const { error } = yield call(
      updateRef, project.snapshot.ref, params
    );

    if (error) {
      actions.setStatus(error.message);
      actions.setSubmitting(false);
    } else {
      yield put(addFlash('Project has been updated.'));
      yield put(subscribeClients());

      if (history.action === 'POP') {
        yield call(history.push, '/clients');
      } else {
        yield call(history.goBack);
      }
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchProjectUpdate() {
  yield takeLatest(PROJECT_UPDATE, projectUpdate);
}

export const sagas = [
  fork(watchProjectCreate),
  fork(watchProjectUpdate)
];
