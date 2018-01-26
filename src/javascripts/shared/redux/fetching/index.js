import _findIndex from 'lodash/findIndex';
import update from 'immutability-helper';

// Constants

const path = 'golfbook/shared/fetching';

const FETCHING_START = `${path}/FETCHING_START`;
const FETCHING_STOP  = `${path}/FETCHING_STOP`;

// Reducer

const initialState = {
  fetching: []
};

const updateFetchingStop = (state, action) => {
  const index = _findIndex(state.fetching, (key) => key === action.key);

  if (index === -1) {
    return state;
  }

  return update(state, { fetching: { $splice: [[index, 1]] } });
};

export default (state = initialState, action) => {
  switch (action.type) {
  case FETCHING_START:
    return update(state, { fetching: { $push: [action.key] } });

  case FETCHING_STOP:
    return updateFetchingStop(state, action);

  default:
    return state;
  }
};

// Actions

export const startFetching = (key) => {
  return { key, type: FETCHING_START };
};

export const stopFetching = (key) => {
  return { key, type: FETCHING_STOP };
};
