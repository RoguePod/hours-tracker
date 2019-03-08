import {
  add,
  convertEntryParamIdsToRefs,
  firestore,
  parseEntry
} from "javascripts/globals";
import {
  call,
  put,
  select,
  spawn,
  takeEvery,
  takeLatest
} from "redux-saga/effects";

import _get from "lodash/get";
import { addFlash } from "javascripts/shared/redux/flashes";
import { createSelector } from "reselect";
import { eventChannel } from "redux-saga";
import moment from "moment-timezone";
import { selectTimezone } from "javascripts/app/redux/app";
import update from "immutability-helper";

// Constants

let channel = null;

const path = "hours-tracker/app/running";

const ENTRY_START = `${path}/ENTRY_START`;
const ENTRY_STOP = `${path}/ENTRY_STOP`;
const ENTRY_SET = `${path}/ENTRY_SET`;
const ENTRY_UPDATE = `${path}/ENTRY_UPDATE`;
const ENTRY_SUBSCRIBE = `${path}/ENTRY_SUBSCRIBE`;
const FETCHING_SET = `${path}/FETCHING_SET`;
const READY = `${path}/READY`;
const RESET = `${path}/RESET`;

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

export const startEntry = params => {
  return { params, type: ENTRY_START };
};

export const stopEntry = () => {
  return { type: ENTRY_STOP };
};

export const subscribeEntry = () => {
  return { type: ENTRY_SUBSCRIBE };
};

export const updateEntry = params => {
  return { params, type: ENTRY_UPDATE };
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

const setEntry = entry => {
  return { entry, type: ENTRY_SET };
};

const setFetching = fetching => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* entryStart({ params }) {
  try {
    yield put(setFetching("Starting..."));

    const { entry, user, timezone } = yield select(state => {
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
      entry.ref.update({ stoppedAt: now });
    }

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

    const response = yield call(add, "entries", {
      ...defaults,
      ...convertEntryParamIdsToRefs(params)
    });

    if (response.error) {
      yield put(addFlash(response.error.message, "red"));
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
    yield put(setFetching("Stopping..."));

    const { entry } = yield select(state => {
      return {
        entry: state.running.entry
      };
    });

    if (entry) {
      const now = moment()
        .utc()
        .valueOf();
      entry.ref.update({ stoppedAt: now, updatedAt: now });
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
    const entry = yield select(state => state.running.entry);

    if (!entry) {
      return;
    }

    yield put(setFetching("Updating..."));

    const updatedAt = moment()
      .utc()
      .valueOf();
    entry.ref.update({
      ...convertEntryParamIdsToRefs(params),
      updatedAt
    });
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntryUpdate() {
  yield takeLatest(ENTRY_UPDATE, entryUpdate);
}

function* handleEntrySubscribe({ snapshot }) {
  const isReady = yield select(state => state.running.ready);

  yield put(setEntry(snapshot));

  if (!isReady) {
    yield put(ready());
  }
}

function* entrySubscribe() {
  const user = yield select(state => state.app.user);

  channel = eventChannel(emit => {
    const unsubscribe = firestore
      .collection("entries")
      .where("stoppedAt", "==", null)
      .where("userRef", "==", user.snapshot.ref)
      .onSnapshot(snapshot => {
        if (snapshot.size === 0) {
          emit({ snapshot: null });
          return;
        }

        snapshot.forEach(entry => {
          emit({ snapshot: entry });
        });
      });

    return () => unsubscribe();
  });

  yield takeEvery(channel, handleEntrySubscribe);
}

function* watchEntrySubscribe() {
  yield takeLatest(ENTRY_SUBSCRIBE, entrySubscribe);
}

export const sagas = [
  spawn(watchEntryStart),
  spawn(watchEntryStop),
  spawn(watchEntryUpdate),
  spawn(watchEntrySubscribe)
];

// Selectors

const selectBaseEntry = state => state.running.entry;
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

export const selectRunningEntryForForm = createSelector(
  [selectEntry],
  entry => {
    if (entry) {
      return {
        clientId: _get(entry, "clientRef.id"),
        description: entry.description,
        id: entry.id,
        projectId: _get(entry, "projectRef.id"),
        startedAt: entry.startedAt,
        stoppedAt: entry.stoppedAt,
        timezone: entry.timezone
      };
    }

    return {
      description: ""
    };
  }
);
