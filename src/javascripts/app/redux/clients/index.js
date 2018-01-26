import {
  all, cancelled, fork, put, select, takeEvery, takeLatest
} from 'redux-saga/effects';
import { firestore, parseClient } from 'javascripts/globals';

import Fuse from 'fuse.js';
import _filter from 'lodash/filter';
import _groupBy from 'lodash/groupBy';
import _keyBy from 'lodash/keyBy';
import _sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';
import { eventChannel } from 'redux-saga';
import update from 'immutability-helper';

// Constants

let channel = null;

const path = 'hours-tracker/app/clients';

const CLIENTS_SET       = `${path}/CLIENTS_SET`;
const CLIENTS_SUBSCRIBE = `${path}/CLIENTS_SUBSCRIBE`;
const READY             = `${path}/READY`;
const RESET             = `${path}/RESET`;

// Reducer

const initialState = {
  clients: [],
  fetching: null,
  ready: false
};

export default (state = initialState, action) => {
  switch (action.type) {
  case CLIENTS_SET:
    return update(state, { clients: { $set: action.clients } });

  case READY:
    return update(state, { ready: { $set: true } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const subscribeClients = () => {
  return { type: CLIENTS_SUBSCRIBE };
};

export const reset = () => {
  if (channel) {
    channel.close();
  }

  return { type: RESET };
};

const ready = () => {
  return { type: READY };
};

const setClients = (clients) => {
  return { clients, type: CLIENTS_SET };
};

// Sagas

function* handleClientsSubscribe({ snapshot }) {
  const isReady = yield select((state) => state.clients.ready);
  const clients = yield all(snapshot.docs.map(parseClient));

  yield put(setClients(_sortBy(clients, 'name')));

  if (!isReady) {
    yield put(ready());
  }
}

function* clientsSubscribe() {
  if (channel) {
    channel.close();
  }

  channel = eventChannel((emit) => {
    const unsubscribe = firestore
      .collection('clients')
      .onSnapshot((snapshot) => {
        emit({ snapshot });
      });

    return () => unsubscribe();
  });

  try {
    yield takeEvery(channel, handleClientsSubscribe);
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* watchClientsSubscribe() {
  yield takeLatest(CLIENTS_SUBSCRIBE, clientsSubscribe);
}

export const sagas = [fork(watchClientsSubscribe)];

// Selectors

export const selectClients = (state) => state.clients.clients;

const fuseOptions = {
  distance: 100,
  keys: ['name', 'projects.name'],
  location: 0,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  threshold: 0.1
};

export const selectQueryableClients = createSelector(
  [selectClients],
  (clients) => {
    const filtered = _filter(clients, (client) => {
      return client.active && _filter(client.projects, 'active').length > 0;
    });

    return filtered.map((client) => {
      return { id: client.id, name: client.name };
    });
  }
);

export const selectQueryableProjects = createSelector(
  [selectClients],
  (clients) => {
    const filtered = _filter(clients, (client) => {
      return client.active && _filter(client.projects, 'active').length > 0;
    });

    const projects = [];

    filtered.forEach((client) => {
      _filter(client.projects, 'active').forEach((project) => {
        projects.push({
          clientId: client.id,
          clientName: client.name,
          projectId: project.id,
          projectName: project.name
        });
      });
    });

    return projects;
  }
);

export const selectQueriedProjects = createSelector(
  [selectQueryableProjects, (_state, query) => query],
  (projects, query) => {
    if (projects.length === 0 || !query || query.length === 0) {
      return {};
    }

    const options = {
      ...fuseOptions,
      keys: ['clientName', 'projectName']
    };

    const searchResults = new Fuse(projects, options).search(query);
    const results       = {};
    const groups        = _groupBy(searchResults, 'clientName');

    for (const clientName of Object.keys(groups)) {
      const group = groups[clientName];

      results[clientName] = {
        name: clientName,
        results: group.map((result) => {
          const projectRef = firestore
            .doc(`clients/${result.clientId}/projects/${result.projectId}`);

          return {
            'data-client-ref': firestore.doc(`clients/${result.clientId}`),
            'data-project-ref': projectRef,
            key: result.projectId,
            name: result.projectName
          };
        })
      };
    }

    return results;
  }
);

export const selectQueriedClients = createSelector(
  [selectQueryableClients, (_state, query) => query],
  (clients, query) => {
    if (clients.length === 0 || !query || query.length === 0) {
      return [];
    }

    const results = new Fuse(clients, fuseOptions).search(query);

    return results.map((client) => {
      return {
        'data-client-ref': firestore.doc(`clients/${client.id}`),
        key: client.id,
        name: client.name
      };
    });
  }
);

export const selectClientsByKey = createSelector(
  [selectClients],
  (clients) => {
    const data = clients.map((client) => {
      const projects = _keyBy(client.projects, 'id');

      return { ...client, projects };
    });

    return _keyBy(data, 'id');
  }
);
