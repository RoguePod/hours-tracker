/* global document */

import "javascripts/initializers/sentry";
import "javascripts/initializers/store";
import "javascripts/initializers/validators";
import "stylesheets/application.scss?main";
import "javascript-detect-element-resize";

import {
  App,
  SignOutPage,
  SignedInStack,
  SignedOutStack
} from "javascripts/app/containers";
import { Route, Switch } from "react-router-dom";
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
  faDollarSign,
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
} from "@fortawesome/free-solid-svg-icons";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { history, store } from "javascripts/app/redux/store";

import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import moment from "moment-timezone";
import registerServiceWorker from "./registerServiceWorker";

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
  faDollarSign,
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

moment.locale("en");

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route component={SignOutPage} path="/sign-out" />
          <Route component={SignedOutStack} path="/sign-in" />
          <Route component={SignedInStack} path="/" />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("app")
);

registerServiceWorker();
