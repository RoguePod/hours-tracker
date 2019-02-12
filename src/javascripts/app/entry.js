/* global document */

import 'stylesheets/application.scss?main';
import 'javascript-detect-element-resize';
import 'javascripts/validators';

/* eslint-disable sort-imports */
import { history, store } from 'javascripts/app/redux/store'; // must be first

import {
  App,
  SignedInStack,
  SignedOutStack,
  SignOutPage
} from 'javascripts/app/containers';
import { Route, Switch } from 'react-router-dom';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBars,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faDownload,
  faEllipsisH,
  faExchangeAlt,
  faExclamationCircle,
  faFilter,
  faLayerGroup,
  faList,
  faPencilAlt,
  faPlay,
  faPlus,
  faSpinner,
  faStop,
  faSyncAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import {
  faCheckSquare,
  faSquare
} from '@fortawesome/free-regular-svg-icons';

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import { library } from '@fortawesome/fontawesome-svg-core';
import registerServiceWorker from './registerServiceWorker';
/* eslint-enable sort-imports */

library.add(
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBars,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCheck,
  faCheckSquare,
  faDownload,
  faEllipsisH,
  faExchangeAlt,
  faExclamationCircle,
  faFilter,
  faLayerGroup,
  faList,
  faPencilAlt,
  faPlay,
  faPlus,
  faSpinner,
  faSquare,
  faStop,
  faSyncAlt,
  faTimes
);

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
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);

registerServiceWorker();
