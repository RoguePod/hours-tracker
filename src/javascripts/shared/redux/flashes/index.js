import { delay, put, spawn, takeEvery } from "redux-saga/effects";

import _findIndex from "lodash/findIndex";
import update from "immutability-helper";

// Constants

const path = "golfbook/shared/flashes";

const FLASH_ADD = `${path}/FLASH_ADD`;
const FLASH_REMOVE = `${path}/FLASH_REMOVE`;
const FLASH_UPDATE = `${path}/FLASH_UPDATE`;
const FLASH_DELETE = `${path}/FLASH_DELETE`;

// Reducer

const initialState = {
  flashes: []
};

const updateUpdateFlash = (state, action) => {
  let bottom = 0;
  const flashes = state.flashes.map(flash => {
    const newFlash = { ...flash };

    if (flash.id === action.id) {
      newFlash.height = Number(action.flash.height);
    }

    if (flash.removed) {
      newFlash.removed = true;
      newFlash.bottom = 0;
    } else {
      bottom += newFlash.height;
      newFlash.bottom = bottom;
    }

    return newFlash;
  });

  return update(state, { flashes: { $set: flashes } });
};

const updateRemoveFlash = (state, action) => {
  let bottom = 0;
  const flashes = state.flashes.map(flash => {
    const newFlash = { ...flash };

    if (flash.id === action.id || flash.removed) {
      newFlash.removed = true;
      newFlash.bottom = 0;
    } else {
      bottom += flash.height;
      newFlash.bottom = bottom;
    }

    return newFlash;
  });

  return update(state, { flashes: { $set: flashes } });
};

const updateDeleteFlash = (state, action) => {
  const index = _findIndex(state.flashes, flash => flash.id === action.id);

  if (index === -1) {
    return state;
  }

  return update(state, { flashes: { $splice: [[index, 1]] } });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FLASH_ADD:
      return update(state, { flashes: { $push: [action.flash] } });

    case FLASH_UPDATE:
      return updateUpdateFlash(state, action);

    case FLASH_REMOVE:
      return updateRemoveFlash(state, action);

    case FLASH_DELETE:
      return updateDeleteFlash(state, action);

    default:
      return state;
  }
};

// Actions

export const removeFlash = id => {
  return { id, type: FLASH_REMOVE };
};

export const addFlash = (message, other = {}) => {
  return {
    flash: { ...other, id: new Date().getTime(), message },
    type: FLASH_ADD
  };
};

export const updateFlash = (id, flash) => {
  return { flash, id, type: FLASH_UPDATE };
};

const deleteFlash = id => {
  return { id, type: FLASH_DELETE };
};

// Sagas

function* flashRemove({ id }) {
  yield delay(1000);

  yield put(deleteFlash(id));
}

function* watchFlashRemove() {
  yield takeEvery(FLASH_REMOVE, flashRemove);
}

export const sagas = [spawn(watchFlashRemove)];
