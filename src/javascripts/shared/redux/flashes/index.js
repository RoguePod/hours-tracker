import _findIndex from 'lodash/findIndex';
import update from 'immutability-helper';

// Constants

const path = 'golfbook/shared/flashes';

const FLASH_ADD    = `${path}/FLASH_ADD`;
const FLASH_REMOVE = `${path}/FLASH_REMOVE`;

// Reducer

const initialState = {
  flashes: []
};

const updateRemoveFlash = (state, action) => {
  const index = _findIndex(state.flashes, (flash) => flash.id === action.id);

  if (index === -1) {
    return state;
  }

  return update(state, { flashes: { $splice: [[index, 1]] } });
};

export default (state = initialState, action) => {
  switch (action.type) {
  case FLASH_ADD:
    return update(state, {
      flashes: {
        $push: [
          {
            color: action.color,
            id: new Date().getTime(),
            message: action.message
          }
        ]
      }
    });

  case FLASH_REMOVE:
    return updateRemoveFlash(state, action);

  default:
    return state;
  }
};

// Actions

export const removeFlash = (id) => {
  return {
    id, type: FLASH_REMOVE
  };
};

export const addFlash = (message, color = 'green') => {
  return {
    color,
    message,
    type: FLASH_ADD
  };
};
