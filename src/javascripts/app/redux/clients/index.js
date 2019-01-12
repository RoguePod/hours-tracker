import {
  all,
  cancelled,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import {
  firestore,
  fromQuery,
  isBlank,
  parseClient
} from 'javascripts/globals';

import Fuse from 'fuse.js';
import _filter from 'lodash/filter';
import _groupBy from 'lodash/groupBy';
import _keyBy from 'lodash/keyBy';
import _sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';
import { eventChannel } from 'redux-saga';
import update from 'immutability-helper';

// Selectors

const perPage = 10;

const fuseOptions = {
  distance: 100,
  keys: ['name', 'projects.name'],
  location: 0,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  threshold: 0.1
};

const selectRouterSearch = (state) => state.router.location.search;
const selectClients = (state) => state.clients.clients;

export const selectQuery = createSelector(
  [selectRouterSearch],
  (query) => {
    const parsedQuery = fromQuery(query);

    const defaults = {
      page: 1
    };

    return { ...defaults, ...parsedQuery };
  }
);

export const selectPaginatedClients = createSelector(
  [selectQuery, selectClients],
  (query, clients) => {
    const { search } = query;
    const page = Number(query.page);

    const pagination = {
      page,
      perPage,
      totalCount: clients.length,
      totalPages: Math.ceil(clients.length / perPage)
    };

    let results = [];
    if (clients.length > 0 && !isBlank(search)) {
      results = new Fuse(clients, fuseOptions).search(search);

      pagination.totalCount = results.length;
      pagination.totalPages = Math.ceil(results.length / perPage);
    } else {
      results = clients.slice(0);
    }

    const start = (page - 1) * perPage;
    const end   = page * perPage;

    return { clients: results.slice(start, end), pagination };
  }
);

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
    if (projects.length === 0 || isBlank(query)) {
      return {};
    }

    const options = {
      ...fuseOptions,
      keys: ['clientName', 'projectName']
    };

    const searchResults = new Fuse(projects, options).search(query);
    const results       = {};
    const groups        = _groupBy(searchResults, 'clientId');

    for (const clientId of Object.keys(groups)) {
      const group = groups[clientId];

      results[clientId] = {
        name: group[0].clientName,
        projects: group.map((result) => {
          const projectRef = firestore
            .doc(`clients/${result.clientId}/projects/${result.projectId}`);

          return {
            clientRef: firestore.doc(`clients/${result.clientId}`),
            id: result.projectId,
            name: result.projectName,
            projectRef
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
    if (clients.length === 0 || isBlank(query)) {
      return [];
    }

    const results = new Fuse(clients, fuseOptions).search(query);

    return results.map((client) => {
      return {
        clientRef: firestore.doc(`clients/${client.id}`),
        id: client.id,
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
    channel = null;
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
      channel = null;
    }
  }
}

function* watchClientsSubscribe() {
  yield takeLatest(CLIENTS_SUBSCRIBE, clientsSubscribe);
}

export const sagas = [fork(watchClientsSubscribe)];
