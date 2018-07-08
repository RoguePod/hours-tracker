import {
  all, cancelled, fork, put, select, takeEvery, takeLatest
} from 'redux-saga/effects';
import { firestore, fromQuery, isBlank, parseEntry } from 'javascripts/globals';

import _filter from 'lodash/filter';
import _sortBy from 'lodash/sortBy';
import _uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';
import { eventChannel } from 'redux-saga';
import moment from 'moment-timezone';
import { selectTimezone } from 'javascripts/app/redux/app';
import update from 'immutability-helper';

// Selectors

const selectRouterSearch = (state) => state.router.location.search;
const selectEntries = (state) => state.dashboard.entries;
const selectUser = (state) => state.app.user;

export const selectQuery = createSelector(
  [selectTimezone, selectRouterSearch],
  (timezone, query) => {
    const parsedQuery = fromQuery(query);

    const date = moment()
      .tz(timezone)
      .startOf('isoWeek');

    const defaults = {
      date: date.format('YYYY-MM-DD')
    };

    if (!isBlank(parsedQuery.date)) {
      const queryDate = moment
        .tz(parsedQuery.date, timezone)
        .startOf('isoWeek');

      if (queryDate.isBefore(date)) {
        parsedQuery.date = queryDate.format('YYYY-MM-DD');

        return { ...defaults, ...parsedQuery };
      }
    }

    return defaults;
  }
);

export const selectDashboardProjectsForUser = createSelector(
  [selectEntries, selectUser, selectQuery, selectTimezone],
  (entries, user, query, timezone) => {
    const { date } = query;
    const startTime = moment.tz(date, timezone).valueOf();
    const endTime   = moment.tz(date, timezone)
      .add(6, 'd')
      .endOf('day')
      .valueOf();

    const filteredEntries = _filter(entries, (entry) => {
      return (
        entry.user.id === user.id &&
        entry.startedAt >= startTime &&
        entry.stoppedAt < endTime
      );
    });

    const projects = _uniqBy(filteredEntries.map((entry) => {
      return {
        client: entry.client,
        project: entry.project
      };
    }), 'project.id');

    return _sortBy(projects, ['client.name', 'project.name']);
  }
);

export const selectDashboardProjects = createSelector(
  [selectEntries, selectQuery, selectTimezone],
  (entries, query, timezone) => {
    const { date } = query;
    const startTime = moment.tz(date, timezone).valueOf();
    const endTime   = moment.tz(date, timezone)
      .add(6, 'd')
      .endOf('day')
      .valueOf();

    const filteredEntries = _filter(entries, (entry) => {
      return (
        entry.startedAt >= startTime &&
        entry.stoppedAt < endTime
      );
    });

    const projects = _uniqBy(filteredEntries.map((entry) => {
      return {
        client: entry.client,
        project: entry.project
      };
    }), 'project.id');

    return _sortBy(projects, ['client.name', 'project.name']);
  }
);

export const selectDashboardUsers = createSelector(
  [selectEntries, selectQuery, selectTimezone],
  (entries, query, timezone) => {
    const { date } = query;
    const startTime = moment.tz(date, timezone).valueOf();
    const endTime   = moment.tz(date, timezone)
      .add(6, 'd')
      .endOf('day')
      .valueOf();

    const filteredEntries = _filter(entries, (entry) => {
      return (
        entry.startedAt >= startTime &&
        entry.stoppedAt < endTime
      );
    });

    const users = _uniqBy(filteredEntries.map((entry) => entry.user), 'id');

    return _sortBy(users, ['name']);
  }
);

// Constants

let channel = null;

const path = 'hours-tracker/app/dashboard';

const ENTRIES_SUBSCRIBE = `${path}/ENTRIES_SUBSCRIBE`;
const ENTRIES_SET       = `${path}/ENTRIES_SET`;
const FETCHING_SET      = `${path}/FETCHING_SET`;
const READY             = `${path}/READY`;
const RESET             = `${path}/RESET`;

// Reducer

const initialState = {
  entries: [],
  fetching: null,
  ready: false
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ENTRIES_SET:
    return update(state, { entries: { $set: action.entries } });

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

export const subscribeEntries = () => {
  return { type: ENTRIES_SUBSCRIBE };
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
  const isReady = yield select((state) => state.dashboard.ready);
  const entries = yield all(snapshot.docs.map(parseEntry));

  yield put(setEntries(entries));

  if (!isReady) {
    yield put(ready());
  }
  yield put(setFetching(null));
}

const buildQuery = (state, emit) => {
  const { query, timezone, user } = state;
  const { date } = query;

  const startTime = moment.tz(date, timezone)
    .startOf('month')
    .valueOf();

  const endTime = moment.tz(date, timezone)
    .add(6, 'd')
    .endOf('month')
    .valueOf();

  let data = firestore
    .collection('entries')
    .where('startedAt', '<', endTime)
    .where('startedAt', '>=', startTime)
    .orderBy('startedAt', 'desc');

  if (user.role !== 'Admin') {
    data = data.where('userRef', '==', user.snapshot.ref);
  }

  data = data.onSnapshot((snapshot) => {
    emit({ snapshot });
  });

  return data;
};

function* entriesSubscribe() {
  yield put(setFetching('Loading Dashboard...'));

  if (channel) {
    channel.close();
  }

  const currentState = yield select((state) => {
    return {
      query: selectQuery(state),
      timezone: selectTimezone(state),
      user: state.app.user
    };
  });

  channel = eventChannel((emit) => {
    const unsubscribe = buildQuery(currentState, emit);

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
