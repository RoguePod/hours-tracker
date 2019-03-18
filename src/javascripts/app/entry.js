/* global document, localStorage */

import "javascripts/initializers/sentry";
import "javascripts/initializers/store";
import "javascripts/initializers/validators";
import "stylesheets/application.scss?main";
import "javascript-detect-element-resize";
import "whatwg-fetch";

import * as AbsintheSocket from "@absinthe/socket";

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

import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { ConnectedRouter } from "connected-react-router";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Socket as PhoenixSocket } from "phoenix";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { createHttpLink } from "apollo-link-http";
import { hasSubscription } from "@jumpn/utils-graphql";
import { library } from "@fortawesome/fontawesome-svg-core";
import moment from "moment-timezone";
import registerServiceWorker from "./registerServiceWorker";
import { setContext } from "apollo-link-context";
import { split } from "apollo-link";

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

const absintheSocketLink = createAbsintheSocketLink(
  AbsintheSocket.create(
    new PhoenixSocket(process.env.WEBSOCKET_ENDPOINT, {
      params: () => ({
        token: localStorage.getItem("token")
      })
    })
  )
);

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_ENDPOINT
});

const authLink = setContext((_, { headers }) => {
  // localStorage.removeItem("token");
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const link = split(
  operation => hasSubscription(operation.query),
  absintheSocketLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ApolloProvider client={client}>
        <App>
          <Switch>
            <Route component={SignOutPage} path="/sign-out" />
            <Route component={SignedOutStack} path="/sign-in" />
            <Route component={SignedInStack} path="/" />
          </Switch>
        </App>
      </ApolloProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("app")
);

registerServiceWorker();
