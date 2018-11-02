/* eslint-disable max-lines */
import {
  all,
  cancelled,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import { firestore, fromQuery, parseEntry } from 'javascripts/globals';

import _filter from 'lodash/filter';
import _groupBy from 'lodash/groupBy';
import _includes from 'lodash/includes';
import _sortBy from 'lodash/sortBy';
import _without from 'lodash/without';
import { createSelector } from 'reselect';
import { eventChannel } from 'redux-saga';
import moment from 'moment-timezone';
import { selectTimezone } from 'javascripts/app/redux/app';
import update from 'immutability-helper';

// Selectors

const selectRouterSearch = (state) => state.router.location.search;
const selectEntries = (state) => state.entries.entries;
const selectChecked = (state) => state.entries.checked;

export const selectQuery = createSelector(
  [selectTimezone, selectRouterSearch],
  (timezone, query) => {
    const parsedQuery = fromQuery(query);
    const defaults    = {
      endDate: '',
      startDate: ''
    };

    if (parsedQuery.clientRef) {
      parsedQuery.clientRef = firestore.doc(parsedQuery.clientRef);
    }

    if (parsedQuery.projectRef) {
      parsedQuery.projectRef = firestore.doc(parsedQuery.projectRef);
    }

    if (parsedQuery.userRef) {
      parsedQuery.userRef = firestore.doc(parsedQuery.userRef);
    }

    return { ...defaults, ...parsedQuery };
  }
);

export const selectRawQuery = createSelector(
  [selectTimezone, selectRouterSearch],
  (timezone, query) => {
    const parsedQuery = fromQuery(query);
    const defaults    = {
      endDate: '',
      startDate: ''
    };

    return { ...defaults, ...parsedQuery };
  }
);

export const selectGroupedEntries = createSelector(
  [selectEntries, selectChecked],
  (entries, checked) => {
    const grouped = {};

    for (const entry of entries) {
      const key = moment.tz(entry.startedAt, entry.timezone)
        .format('dddd, MMM Do');

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
  (entries) => {
    return entries.map((entry) => {
      const startedAt = moment.tz(entry.startedAt, entry.timezone);
      let stoppedAt   = null;

      if (entry.stoppedAt) {
        stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
      } else {
        stoppedAt = moment().tz(entry.timezone);
      }

      return {
        ...entry,
        hours: stoppedAt.diff(startedAt, 'hours', true),
        startedAtMoment: startedAt,
        stoppedAtMoment: stoppedAt
      };
    });
  }
);

export const selectUsersByEntries = createSelector(
  [selectEntriesWithHours],
  (entries) => {
    const users = _groupBy(entries, (entry) => entry.user.name);

    return users;
  }
);

export const selectClientsByEntries = createSelector(
  [selectEntriesWithHours],
  (entries) => {
    let clients = _groupBy(
      _filter(entries, 'client'), (entry) => entry.client.name
    );

    clients = Object.keys(clients).map((name) => {
      return {
        name, projects: _groupBy(clients[name], (entry) => entry.project.name)
      };
    });

    return _sortBy(clients, 'name');
  }
);

// Constants

let channel = null;

const path = 'hours-tracker/app/entries';

const ENTRY_CHECK       = `${path}/ENTRY_CHECK`;
const ENTRIES_SUBSCRIBE = `${path}/ENTRIES_SUBSCRIBE`;
const ENTRIES_SET       = `${path}/ENTRIES_SET`;
const FETCHING_SET      = `${path}/FETCHING_SET`;
const READY             = `${path}/READY`;
const RESET             = `${path}/RESET`;

// Reducer

const initialState = {
  checked: [],
  entries: [],
  fetching: null,
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

  case READY:
    return update(state, { ready: { $set: true } });

  case RESET:
    return initialState;

  default:
    return state;
  }
};

// Actions

export const subscribeEntries = (limit) => {
  return { limit, type: ENTRIES_SUBSCRIBE };
};

export const checkEntry = (id) => {
  return { id, type: ENTRY_CHECK };
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

const setEntries = (entries) => {
  return { entries, type: ENTRIES_SET };
};

const setFetching = (fetching) => {
  return { fetching, type: FETCHING_SET };
};

// Sagas

function* handleEntriesSubscribe({ snapshot }) {
  const currentState = yield select((state) => state.entries);
  const entries = yield all(snapshot.docs.map(parseEntry));

  yield put(setEntries(entries));

  if (!currentState.ready) {
    yield put(ready());
  }
  yield put(setFetching(null));
}

/* eslint-disable max-statements */
const buildQuery = (state, limit, emit) => {
  const { pathname, query, timezone, user } = state;
  const { clientRef, endDate, projectRef, startDate, userRef } = query;

  let data = firestore
    .collection('entries')
    .orderBy('startedAt', 'desc');

  if (limit) {
    data = data.limit(limit);
  }

  if (pathname.match(/reports/u) && user.role === 'Admin') {
    if (userRef) {
      data = data.where('userRef', '==', userRef);
    }
  } else {
    data = data.where('userRef', '==', user.snapshot.ref);
  }

  if (clientRef) {
    data = data.where('clientRef', '==', clientRef);
  }

  if (projectRef) {
    data = data.where('projectRef', '==', projectRef);
  }

  if (startDate && startDate.length > 0) {
    data = data.where(
      'startedAt', '>=',
      moment.tz(startDate, timezone)
        .valueOf()
    );
  }

  if (endDate && endDate.length > 0) {
    data = data.where(
      'startedAt', '<=',
      moment.tz(endDate, timezone)
        .endOf('day')
        .valueOf()
    );
  }

  data = data.onSnapshot((snapshot) => emit({ snapshot }));

  return data;
};
/* eslint-enable max-statements */

function* entriesSubscribe({ limit }) {
  yield put(setFetching('Getting Entries...'));

  if (channel) {
    channel.close();
  }

  const currentState = yield select((state) => {
    return {
      pathname: state.router.location.pathname,
      query: selectQuery(state),
      timezone: selectTimezone(state),
      user: state.app.user
    };
  });

  channel = eventChannel((emit) => {
    const unsubscribe = buildQuery(currentState, limit, emit);

    return () => unsubscribe();
  });

  try {
    yield takeEvery(channel, handleEntriesSubscribe);
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* watchEntriesSubscribe() {
  yield takeLatest(ENTRIES_SUBSCRIBE, entriesSubscribe);
}

export const sagas = [fork(watchEntriesSubscribe)];
