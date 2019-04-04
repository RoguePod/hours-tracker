/* eslint-disable max-lines */

import {
  add,
  batchCommit,
  convertEntryParamIdsToRefs,
  deleteDoc,
  firestore,
  parseEntry,
  updateRef
} from "javascripts/globals";
import { call, put, select, spawn, takeLatest } from "redux-saga/effects";

import _get from "lodash/get";
import _pick from "lodash/pick";
import { addFlash } from "javascripts/shared/redux/flashes";
import { createSelector } from "reselect";
import { eventChannel } from "redux-saga";
import { history } from "javascripts/app/redux/store";
import moment from "moment-timezone";
import { selectTimezone } from "javascripts/app/redux/app";
import update from "immutability-helper";

// Selectors

const selectBaseEntry = state => state.entry.entry;
const selectClients = state => state.clients.clients;
const selectAppUser = state => state.app.user;
const selectUsers = state => state.users.users;

export const selectEntry = createSelector(
  [selectBaseEntry, selectClients, selectAppUser, selectUsers],
  (entry, clients, appUser, users) => {
    if (entry) {
      return parseEntry(entry, clients, appUser, users);
    }

    return null;
  }
);

export const selectEntryForForm = createSelector(
  [selectEntry, selectTimezone],
  (entry, timezone) => {
    if (!entry) {
      return {
        clientId: null,
        description: "",
        projectId: null,
        startedAt: null,
        stoppedAt: null,
        timezone
      };
    }

    return {
      clientId: _get(entry, "clientRef.id"),
      description: entry.description,
      projectId: _get(entry, "projectRef.id"),
      startedAt: entry.startedAt,
      stoppedAt: entry.stoppedAt,
      timezone: entry.timezone || timezone
    };
  }
);

// Constants

let channel = null;

const path = "hours-tracker/app/entry";

const ENTRY_SET = `${path}/ENTRY_SET`;
const ENTRY_GET = `${path}/ENTRY_GET`;
const ENTRY_UPDATE = `${path}/ENTRY_UPDATE`;
const ENTRY_SPLIT = `${path}/ENTRY_SPLIT`;
const ENTRY_CREATE = `${path}/ENTRY_CREATE`;
const ENTRY_DESTROY = `${path}/ENTRY_DESTROY`;
const FETCHING_SET = `${path}/FETCHING_SET`;
const RESET = `${path}/RESET`;

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

export const getEntry = id => {
  return { id, type: ENTRY_GET };
};

export const createEntry = (params, actions) => {
  return { actions, params, type: ENTRY_CREATE };
};

export const updateEntry = (params, actions) => {
  return { actions, params, type: ENTRY_UPDATE };
};

export const splitEntry = (params, actions) => {
  return { actions, params, type: ENTRY_SPLIT };
};

export const destroyEntry = id => {
  return { id, type: ENTRY_DESTROY };
};

export const reset = () => {
  if (channel) {
    channel.close();
    channel = null;
  }

  return { type: RESET };
};

const setEntry = entry => {
  return { entry, type: ENTRY_SET };
};

const setFetching = fetching => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* handleEntrySubscribe({ snapshot }) {
  yield put(setEntry(snapshot));
  yield put(setFetching(null));
}

function* entryGet({ id }) {
  yield put(setEntry(null));
  yield put(setFetching("Getting Entry..."));

  if (channel) {
    channel.close();
  }

  channel = eventChannel(emit => {
    const unsubscribe = firestore.doc(`entries/${id}`).onSnapshot(snapshot => {
      emit({ snapshot });
    });

    return () => unsubscribe();
  });

  yield takeLatest(channel, handleEntrySubscribe);
}

function* watchEntryGet() {
  yield takeLatest(ENTRY_GET, entryGet);
}

function* entryCreate({ actions, params }) {
  const { timezone, user } = yield select(state => {
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
    description: "",
    projectRef: null,
    startedAt: now,
    stoppedAt: null,
    timezone,
    updatedAt: now,
    userRef: user.snapshot.ref
  };

  const { error } = yield call(add, "entries", {
    ...defaults,
    ...convertEntryParamIdsToRefs(params)
  });

  if (error) {
    actions.setStatus(error.message);
    actions.setSubmitting(false);
  } else {
    yield put(addFlash("Entry has been created."));

    if (history.action === "POP") {
      yield call(history.push, "/entries");
    } else {
      yield call(history.goBack);
    }
  }
}

function* watchEntryCreate() {
  yield takeLatest(ENTRY_CREATE, entryCreate);
}

function* entryUpdate({ actions, params }) {
  const entry = yield select(state => state.entry.entry);
  const updatedAt = moment()
    .utc()
    .valueOf();

  const { error } = yield call(updateRef, entry.ref, {
    ...convertEntryParamIdsToRefs(params),
    updatedAt
  });

  if (error) {
    actions.setStatus(error.message);
    actions.setSubmitting(false);
  } else {
    yield put(addFlash("Entry has been updated."));

    if (history.action === "POP") {
      yield call(history.push, "/entries");
    } else {
      yield call(history.goBack);
    }
  }
}

function* watchEntryUpdate() {
  yield takeLatest(ENTRY_UPDATE, entryUpdate);
}

function* entrySplit({ actions, params }) {
  const { entry: currentEntry, timezone, user } = yield select(state => {
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
    description: "",
    projectRef: null,
    startedAt: now,
    stoppedAt: null,
    timezone,
    updatedAt: now,
    userRef: user.snapshot.ref
  };

  const entries = params.entries.map(entry => {
    return convertEntryParamIdsToRefs(
      _pick(entry, [
        "clientId",
        "description",
        "projectId",
        "startedAt",
        "stoppedAt",
        "timezone"
      ])
    );
  });

  const batch = firestore.batch();

  currentEntry.ref.update({ ...defaults, ...entries[0] });

  entries.slice(1).forEach(newEntry => {
    const data = { ...defaults, ...newEntry };
    firestore.collection("entries").add(data);
  });

  const { error } = yield call(batchCommit, batch);

  if (error) {
    actions.setStatus(error.message);
    actions.setSubmitting(false);
  } else {
    yield put(addFlash("Entry has been split"));
    history.push("/entries");
  }
}

function* watchEntrySplit() {
  yield takeLatest(ENTRY_SPLIT, entrySplit);
}

function* entryDestroy({ id }) {
  try {
    yield put(setFetching("Deleting Entry..."));

    const { error } = yield call(deleteDoc, `entries/${id}`);

    if (error) {
      yield put(addFlash(error.message, "red"));
    } else {
      yield put(addFlash("Entry has been removed"));
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryDestroy() {
  yield takeLatest(ENTRY_DESTROY, entryDestroy);
}

export const sagas = [
  spawn(watchEntryGet),
  spawn(watchEntryCreate),
  spawn(watchEntryUpdate),
  spawn(watchEntrySplit),
  spawn(watchEntryDestroy)
];
