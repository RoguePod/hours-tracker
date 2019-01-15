import _flatten from 'lodash/flatten';
import { all } from 'redux-saga/effects';
import { sagas as app } from 'javascripts/app/redux/app';
import { sagas as clients } from 'javascripts/app/redux/clients';
import { sagas as dashboard } from 'javascripts/app/redux/dashboard';
import { sagas as entries } from 'javascripts/app/redux/entries';
import { sagas as entry } from 'javascripts/app/redux/entry';
import { sagas as flashes } from 'javascripts/shared/redux/flashes';
import { sagas as passwords } from 'javascripts/app/redux/passwords';
import { sagas as projects } from 'javascripts/app/redux/projects';
import { sagas as recents } from 'javascripts/app/redux/recents';
import { sagas as running } from 'javascripts/app/redux/running';
import { sagas as user } from 'javascripts/app/redux/user';
import { sagas as users } from 'javascripts/app/redux/users';

export default function* root() {
  yield all(_flatten([
    app,
    clients,
    dashboard,
    entries,
    entry,
    flashes,
    passwords,
    projects,
    recents,
    running,
    user,
    users
  ]));
}
