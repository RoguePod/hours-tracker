import 'stylesheets/application.scss?main';

/* eslint-disable sort-imports */
import { history, store } from 'javascripts/app/redux/store'; // must be first

import {
  App,
  SignedInStack,
  SignedOutStack,
  SignOutPage
} from 'javascripts/app/containers';
import { Route, Switch } from 'react-router-dom';

import { ConnectedRouter } from 'react-router-redux';
import { NoMatchPage } from 'javascripts/shared/containers';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import registerServiceWorker from './registerServiceWorker';
/* eslint-enable sort-imports */

moment.locale('en');

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route
            component={SignOutPage}
            path="/sign-out"
          />
          <Route
            component={SignedOutStack}
            path="/sign-in"
          />
          <Route
            component={SignedInStack}
            path="/"
          />
          <Route
            component={NoMatchPage}
          />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>,
  /* eslint-disable no-undef */
  document.getElementById('app')
  /* eslint-enable no-undef */
);

registerServiceWorker();
