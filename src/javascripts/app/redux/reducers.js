import app from 'javascripts/app/redux/app';
import client from 'javascripts/app/redux/client';
import clients from 'javascripts/app/redux/clients';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import dashboard from 'javascripts/app/redux/dashboard';
import entries from 'javascripts/app/redux/entries';
import entry from 'javascripts/app/redux/entry';
import fetching from 'javascripts/shared/redux/fetching';
import flashes from 'javascripts/shared/redux/flashes';
import { reducer as form } from 'redux-form';
import project from 'javascripts/app/redux/project';
import recents from 'javascripts/app/redux/recents';
import running from 'javascripts/app/redux/running';
import user from 'javascripts/app/redux/user';
import users from 'javascripts/app/redux/users';

export default (history) => combineReducers({
  app,
  client,
  clients,
  dashboard,
  entries,
  entry,
  fetching,
  flashes,
  form,
  project,
  recents,
  router: connectRouter(history),
  running,
  user,
  users
});
