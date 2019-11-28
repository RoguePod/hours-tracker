import _flatten from 'lodash/flatten';
import { all } from 'redux-saga/effects';
import { sagas as app } from 'javascripts/shared/redux/app';
import { sagas as flashes } from 'javascripts/shared/redux/flashes';

export default function* root() {
  yield all(_flatten([app, flashes]));
}
