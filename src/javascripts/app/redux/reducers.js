import app from 'javascripts/app/redux/app';
import clients from 'javascripts/app/redux/clients';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import dashboard from 'javascripts/app/redux/dashboard';
import entries from 'javascripts/app/redux/entries';
import entry from 'javascripts/app/redux/entry';
import fetching from 'javascripts/shared/redux/fetching';
import flashes from 'javascripts/shared/redux/flashes';
import { reducer as form } from 'redux-form';
import projects from 'javascripts/app/redux/projects';
import recents from 'javascripts/app/redux/recents';
import running from 'javascripts/app/redux/running';
import user from 'javascripts/app/redux/user';
import users from 'javascripts/app/redux/users';

export default (history) => combineReducers({
  app,
  clients,
  dashboard,
  entries,
  entry,
  fetching,
  flashes,
  form,
  projects,
  recents,
  router: connectRouter(history),
  running,
  user,
  users
});
