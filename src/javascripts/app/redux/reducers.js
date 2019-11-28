import app from 'javascripts/shared/redux/app';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import flashes from 'javascripts/shared/redux/flashes';

export default (history) =>
  combineReducers({
    app,
    flashes,
    router: connectRouter(history)
  });
