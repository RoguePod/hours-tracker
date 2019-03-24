/* global localStorage */

import * as AbsintheSocket from "@absinthe/socket";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Socket as PhoenixSocket } from "phoenix";
import _uniqueId from "lodash/uniqueId";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";
import { createHttpLink } from "apollo-link-http";
import { hasSubscription } from "@jumpn/utils-graphql";
import { setContext } from "apollo-link-context";
import { split } from "apollo-link";

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_ENDPOINT
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ""
    }
  };
});

class GraphQLClient {
  client = null;
  id = null;
  socket = null;

  constructor(token) {
    this.id = _uniqueId("apolloClient_");

    if (token) {
      this._signIn(token);
    } else {
      this._signOut();
    }
  }

  close() {
    if (this.client) {
      this.client.clearStore();
      this.client.stop();

      this.client = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  _signIn(token) {
    this.socket = this._createSocket(token);

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: this._createSignedInLink()
    });
  }

  _signOut() {
    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: this._createSignedOutLink()
    });
  }

  _createSignedInLink() {
    return split(
      operation => hasSubscription(operation.query),
      createAbsintheSocketLink(AbsintheSocket.create(this.socket)),
      authLink.concat(httpLink)
    );
  }

  _createSignedOutLink() {
    return authLink.concat(httpLink);
  }

  _createSocket(token) {
    return new PhoenixSocket(process.env.WEBSOCKET_ENDPOINT, {
      params: () => ({ token }),
      reconnect: true
    });
  }
}

export default GraphQLClient;
