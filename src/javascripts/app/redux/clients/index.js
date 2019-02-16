/* eslint-disable max-lines */

import {
  add,
  firestore,
  fromQuery,
  isBlank,
  parseClient,
  updateRef
} from "javascripts/globals";
import {
  all,
  call,
  cancelled,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from "redux-saga/effects";

import Fuse from "fuse.js";
import _filter from "lodash/filter";
import _find from "lodash/find";
import _sortBy from "lodash/sortBy";
import { addFlash } from "javascripts/shared/redux/flashes";
import { createSelector } from "reselect";
import { eventChannel } from "redux-saga";
import { history } from "javascripts/app/redux/store";
import update from "immutability-helper";

// Selectors

const perPage = 10;

export const fuseOptions = {
  distance: 100,
  keys: ["name", "projects.name"],
  location: 0,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  threshold: 0.1
};

const selectRouterSearch = state => state.router.location.search;
const selectClients = state => state.clients.clients;

export const selectClient = createSelector(
  [selectClients, (_state, id) => id],
  (clients, id) => _find(clients, ["id", id])
);

export const selectProject = createSelector(
  [
    selectClients,
    (_state, clientId) => clientId,
    (_state, _clientId, id) => id
  ],
  (clients, clientId, id) => {
    const client = _find(clients, ["id", clientId]);

    if (!client) {
      return null;
    }

    return _find(client.projects, ["id", id]);
  }
);

export const selectQuery = createSelector(
  [selectRouterSearch],
  query => {
    const parsedQuery = fromQuery(query);

    const defaults = {
      page: 1,
      search: ""
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
    const end = page * perPage;

    return { clients: results.slice(start, end), pagination };
  }
);

export const selectQueryableClients = createSelector(
  [selectClients],
  clients => {
    const filtered = _filter(clients, client => {
      return client.active && _filter(client.projects, "active").length > 0;
    });

    return filtered.map(client => {
      return { id: client.id, name: client.name };
    });
  }
);

export const selectQueryableProjects = createSelector(
  [selectClients],
  clients => {
    const filtered = _filter(clients, client => {
      return client.active && _filter(client.projects, "active").length > 0;
    });

    const projects = [];

    filtered.forEach(client => {
      _filter(client.projects, "active").forEach(project => {
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

// Constants

let channel = null;

const path = "hours-tracker/app/clients";

const CLIENTS_SET = `${path}/CLIENTS_SET`;
const CLIENTS_SUBSCRIBE = `${path}/CLIENTS_SUBSCRIBE`;
const CLIENT_UPDATE = `${path}/CLIENT_UPDATE`;
const CLIENT_CREATE = `${path}/CLIENT_CREATE`;
const READY = `${path}/READY`;
const FETCHING_SET = `${path}/FETCHING_SET`;
const RESET = `${path}/RESET`;

// Reducer

const initialState = {
  clients: [],
  fetching: null,
  ready: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_SET:
      return update(state, { fetching: { $set: action.fetching } });

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

export const createClient = (params, actions) => {
  return { actions, params, type: CLIENT_CREATE };
};

export const updateClient = (client, params, actions) => {
  return { actions, client, params, type: CLIENT_UPDATE };
};

export const reset = () => {
  if (channel) {
    channel.close();
    channel = null;
  }

  return { type: RESET };
};

const setFetching = fetching => {
  return { fetching, type: FETCHING_SET };
};

const ready = () => {
  return { type: READY };
};

const setClients = clients => {
  return { clients, type: CLIENTS_SET };
};

// Sagas

function* handleClientsSubscribe({ snapshot }) {
  const isReady = yield select(state => state.clients.ready);
  const clients = yield all(snapshot.docs.map(parseClient));

  yield put(setClients(_sortBy(clients, "name")));

  if (!isReady) {
    yield put(ready());
  }
}

function* clientsSubscribe() {
  /* eslint-disable no-console */
  console.log("clientsSubscribe");
  /* eslint-enable no-console */

  if (channel) {
    channel.close();
  }

  channel = eventChannel(emit => {
    const unsubscribe = firestore.collection("clients").onSnapshot(snapshot => {
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

function* clientCreate({ actions, params }) {
  try {
    yield put(setFetching("Creating Client..."));

    const { error } = yield call(add, "clients", params);

    if (error) {
      actions.setStatus(error.message);
      actions.setSubmitting(false);
    } else {
      yield put(addFlash("Client has been created."));

      if (history.action === "POP") {
        yield call(history.push, "/clients");
      } else {
        yield call(history.goBack);
      }
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchClientCreate() {
  yield takeLatest(CLIENT_CREATE, clientCreate);
}

function* clientUpdate({ actions, client, params }) {
  try {
    yield put(setFetching("Updating Client..."));

    const { error } = yield call(updateRef, client.snapshot.ref, params);

    if (error) {
      actions.setStatus(error.message);
    } else {
      yield put(addFlash("Client has been updated."));

      if (history.action === "POP") {
        yield call(history.push, "/clients");
      } else {
        yield call(history.goBack);
      }
    }
  } finally {
    actions.setSubmitting(false);
    yield put(setFetching(null));
  }
}

function* watchClientUpdate() {
  yield takeLatest(CLIENT_UPDATE, clientUpdate);
}

export const sagas = [
  fork(watchClientsSubscribe),
  fork(watchClientCreate),
  fork(watchClientUpdate)
];
