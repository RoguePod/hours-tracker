/* eslint-disable max-lines */

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
import {
  batchCommit,
  convertEntryParamIdsToRefs,
  firebase,
  firestore,
  fromQuery,
  isBlank,
  isDate,
  parseEntry
} from "javascripts/globals";

import _filter from "lodash/filter";
import _flatten from "lodash/flatten";
import _groupBy from "lodash/groupBy";
import _includes from "lodash/includes";
import _map from "lodash/map";
import _omit from "lodash/omit";
import _sortBy from "lodash/sortBy";
import _values from "lodash/values";
import _without from "lodash/without";
import { addFlash } from "javascripts/shared/redux/flashes";
import { createSelector } from "reselect";
import { eventChannel } from "redux-saga";
import { history } from "javascripts/app/redux/store";
import moment from "moment-timezone";
import { selectTimezone } from "javascripts/app/redux/app";
import update from "immutability-helper";

// Selectors

const selectRouterSearch = state => state.router.location.search;
const selectEntries = state => state.entries.entries;
const selectChecked = state => state.entries.checked;

export const selectQuery = createSelector(
  [selectRouterSearch],
  query => {
    const parsedQuery = fromQuery(query);
    const defaults = {
      endDate: "",
      startDate: ""
    };

    return { ...defaults, ...parsedQuery };
  }
);

export const selectGroupedEntries = createSelector(
  [selectEntries, selectChecked],
  (entries, checked) => {
    const grouped = {};

    for (const entry of entries) {
      const key = moment
        .tz(entry.startedAt, entry.timezone)
        .format("dddd, MMM Do");

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push({
        ...entry,
        checked: _includes(checked, entry.id)
      });
    }

    return grouped;
  }
);

export const selectEntriesWithHours = createSelector(
  [selectEntries],
  entries => {
    return entries.map(entry => {
      const startedAt = moment.tz(entry.startedAt, entry.timezone);
      let stoppedAt = null;

      if (entry.stoppedAt) {
        stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
      } else {
        stoppedAt = moment().tz(entry.timezone);
      }

      return {
        ...entry,
        hours: stoppedAt.diff(startedAt, "hours", true),
        startedAtMoment: startedAt,
        stoppedAtMoment: stoppedAt
      };
    });
  }
);

export const selectUsersByEntries = createSelector(
  [selectEntriesWithHours],
  entries => {
    const users = _groupBy(entries, entry => entry.user.name);

    return users;
  }
);

export const selectClientsByEntries = createSelector(
  [selectEntriesWithHours],
  entries => {
    let clients = _groupBy(
      _filter(entries, "client"),
      entry => entry.client.name
    );

    clients = Object.keys(clients).map(name => {
      return {
        name,
        projects: _groupBy(clients[name], entry => entry.project.name)
      };
    });

    return _sortBy(clients, "name");
  }
);

// Constants

let channel = null;

const path = "hours-tracker/app/entries";

const CHECKED_SET = `${path}/CHECKED_SET`;
const CHECKED_TOGGLE = `${path}/CHECKED_TOGGLE`;
const ENTRIES_DESTROY = `${path}/ENTRIES_DESTROY`;
const ENTRIES_SET = `${path}/ENTRIES_SET`;
const ENTRIES_SUBSCRIBE = `${path}/ENTRIES_SUBSCRIBE`;
const ENTRIES_UPDATE = `${path}/ENTRIES_UPDATE`;
const ENTRY_CHECK = `${path}/ENTRY_CHECK`;
const FETCHING_SET = `${path}/FETCHING_SET`;
const LOCATION_SET = `${path}/LOCATION_SET`;
const READY = `${path}/READY`;
const RESET = `${path}/RESET`;

// Reducer

const initialState = {
  checked: [],
  entries: [],
  fetching: null,
  location: null,
  ready: false
};

const updateEntryCheck = (state, action) => {
  const { id } = action;

  if (_includes(state.checked, id)) {
    return update(state, { checked: { $set: _without(state.checked, id) } });
  }

  return update(state, { checked: { $push: [id] } });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTRY_CHECK:
      return updateEntryCheck(state, action);

    case ENTRIES_SET:
      return update(state, {
        checked: { $set: [] },
        entries: { $set: action.entries }
      });

    case FETCHING_SET:
      return update(state, { fetching: { $set: action.fetching } });

    case CHECKED_SET:
      return update(state, { checked: { $set: action.checked } });

    case CHECKED_TOGGLE:
      if (state.checked.length === _flatten(_values(state.entries)).length) {
        return update(state, { checked: { $set: [] } });
      }

      return update(state, { checked: { $set: _map(state.entries, "id") } });

    case READY:
      return update(state, { ready: { $set: true } });

    case LOCATION_SET:
      return update(state, {
        location: { $set: _omit(action.location, "key") }
      });

    case RESET:
      if (channel) {
        channel.close();
        channel = null;
      }

      return update(state, {
        checked: { $set: [] },
        entries: { $set: [] },
        fetching: { $set: null },
        ready: { $set: false }
      });

    default:
      return state;
  }
};

// Actions

export const subscribeEntries = limit => {
  return { limit, type: ENTRIES_SUBSCRIBE };
};

export const destroyEntries = () => {
  return { type: ENTRIES_DESTROY };
};

export const checkEntry = id => {
  return { id, type: ENTRY_CHECK };
};

export const toggleChecked = () => {
  return { type: CHECKED_TOGGLE };
};

const setChecked = checked => {
  return { checked, type: CHECKED_SET };
};

export const updateEntries = (params, actions) => {
  return { actions, params, type: ENTRIES_UPDATE };
};

export const setLocation = location => {
  return { location, type: LOCATION_SET };
};

export const reset = () => {
  return { type: RESET };
};

const ready = () => {
  return { type: READY };
};

const setEntries = entries => {
  return { entries, type: ENTRIES_SET };
};

const setFetching = fetching => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* handleEntriesSubscribe({ snapshot }) {
  const currentState = yield select(state => state.entries);
  const entries = yield all(snapshot.docs.map(parseEntry));

  yield put(setEntries(entries));

  if (!currentState.ready) {
    yield put(ready());
  }
  // yield delay(1000);
  yield put(setFetching(null));
}

const buildQuery = (state, limit, emit) => {
  const { pathname, query, timezone, user } = state;
  const { clientId, endDate, projectId, startDate, userId } = query;

  let data = firestore.collection("entries").orderBy("startedAt", "desc");

  if (limit) {
    data = data.limit(limit);
  }

  if (pathname.match(/reports/u) && user.role === "Admin") {
    if (!isBlank(userId)) {
      data = data.where("userRef", "==", firestore.doc(`users/${userId}`));
    }
  } else {
    data = data.where("userRef", "==", user.snapshot.ref);
  }

  if (!isBlank(clientId)) {
    data = data.where("clientRef", "==", firestore.doc(`clients/${clientId}`));

    if (!isBlank(projectId)) {
      data = data.where(
        "projectRef",
        "==",
        firestore.doc(`clients/${clientId}/projects/${projectId}`)
      );
    }
  }

  if (isDate(startDate)) {
    data = data.where(
      "startedAt",
      ">=",
      moment.tz(startDate, timezone).valueOf()
    );
  }

  if (isDate(endDate)) {
    data = data.where(
      "startedAt",
      "<=",
      moment
        .tz(endDate, timezone)
        .endOf("day")
        .valueOf()
    );
  }

  data = data.onSnapshot(snapshot => emit({ snapshot }));

  return data;
};

function* entriesSubscribe({ limit }) {
  yield put(setFetching("Getting Entries..."));

  if (channel) {
    channel.close();
  }

  yield put(setChecked([]));

  const currentState = yield select(state => {
    return {
      pathname: state.router.location.pathname,
      query: selectQuery(state),
      timezone: selectTimezone(state),
      user: state.app.user
    };
  });

  channel = eventChannel(emit => {
    const unsubscribe = buildQuery(currentState, limit, emit);

    return () => unsubscribe();
  });

  try {
    yield takeEvery(channel, handleEntriesSubscribe);
  } finally {
    if (yield cancelled()) {
      channel.close();
      channel = null;
    }
  }
}

function* watchEntriesSubscribe() {
  yield takeLatest(ENTRIES_SUBSCRIBE, entriesSubscribe);
}

function* entriesDestroy() {
  try {
    yield put(setFetching("Deleting Entries..."));

    const ids = yield select(state => state.entries.checked);

    const {
      data: { error }
    } = yield call(firebase.functions().httpsCallable("deleteEntries"), {
      ids
    });

    if (error) {
      yield put(addFlash(error, "red"));
    } else {
      yield put(addFlash("Entries have been removed"));
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntriesDestroy() {
  yield takeLatest(ENTRIES_DESTROY, entriesDestroy);
}

function* entriesUpdate({ actions, params }) {
  try {
    yield put(setFetching("Updating Entries..."));

    const { entries } = yield select(state => {
      return {
        entries: _filter(
          _flatten(_values(selectGroupedEntries(state))),
          "checked"
        )
      };
    });

    const now = moment()
      .utc()
      .valueOf();
    const batch = firestore.batch();

    entries.forEach(entry => {
      entry.snapshot.ref.update({
        ...convertEntryParamIdsToRefs(_omit(params, "update")),
        updatedAt: now
      });
    });

    const { error } = yield call(batchCommit, batch);

    if (error) {
      actions.setStatus(error.message);
      actions.setSubmitting(false);
    } else {
      yield put(addFlash("Entries have been updated."));

      yield call(history.goBack);
    }
  } finally {
    yield put(setFetching(null));
  }
}

function* watchEntriesUpdate() {
  yield takeLatest(ENTRIES_UPDATE, entriesUpdate);
}

export const sagas = [
  fork(watchEntriesSubscribe),
  fork(watchEntriesDestroy),
  fork(watchEntriesUpdate)
];
