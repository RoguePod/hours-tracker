import * as AbsintheSocket from '@absinthe/socket';

import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';

import { ApolloClient } from 'apollo-client';
import { COOKIE_PATHS } from 'javascripts/globals';
import Cookies from 'js-cookie';
import { Socket as PhoenixSocket } from 'phoenix';
import _uniqueId from 'lodash/uniqueId';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { hasSubscription } from '@jumpn/utils-graphql';
import history from 'javascripts/history';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { split } from 'apollo-link';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_ENDPOINT
});

const inMemoryCacheParams = {
  dataIdFromObject: (object) => {
    // console.log(
    //   'defaultDataIdFromObject',
    //   defaultDataIdFromObject(object),
    //   object
    // );
    if (object.__typename === 'Session') {
      return `Session:${object.token}`;
    }
    return defaultDataIdFromObject(object);
  }
};

const authErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      const token = Cookies.get(COOKIE_PATHS.token);

      if (
        token &&
        (message === 'Token Expired' || message === 'Invalid Token')
      ) {
        history.push('/sign-out');
      }
    });
  }

  if (networkError) {
    /* eslint-disable no-console */
    console.log(`[Network error]: ${networkError}`);
    /* eslint-disable no-console */
  }
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get(COOKIE_PATHS.token);

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

class GraphQLClient {
  client = null;

  id = null;

  socket = null;

  constructor(token) {
    this.id = _uniqueId('apolloClient_');

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
      cache: new InMemoryCache(inMemoryCacheParams),
      link: this._createSignedInLink()
    });
  }

  _signOut() {
    this.client = new ApolloClient({
      cache: new InMemoryCache(inMemoryCacheParams),
      link: this._createSignedOutLink()
    });
  }

  _createSignedInLink() {
    return split(
      (operation) => hasSubscription(operation.query),
      createAbsintheSocketLink(AbsintheSocket.create(this.socket)),
      authErrorLink.concat(authLink.concat(httpLink))
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
