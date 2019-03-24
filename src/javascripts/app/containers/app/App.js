/* global window,document */

import { loadApp, updateWindow } from "javascripts/app/redux/app";

import { ApolloProvider } from "react-apollo";
import { Flashes } from "javascripts/shared/components";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import cx from "classnames";
import { history } from "javascripts/app/redux/store";
import { withRouter } from "react-router-dom";

class App extends React.Component {
  static propTypes = {
    apolloClient: PropTypes.apolloClient.isRequired,
    children: PropTypes.node.isRequired,
    fetching: PropTypes.bool,
    flashes: PropTypes.arrayOf(PropTypes.flash).isRequired,
    location: PropTypes.routerLocation.isRequired,
    onLoadApp: PropTypes.func.isRequired,
    onUpdateWindow: PropTypes.func.isRequired,
    token: PropTypes.string,
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    auth: null,
    fetching: false,
    token: false
  };

  constructor(props) {
    super(props);

    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleUpdateWindow = this._handleUpdateWindow.bind(this);
  }

  componentDidMount() {
    const { onLoadApp } = this.props;

    onLoadApp();

    window.addEventListener("resize", this._handleUpdateWindow);

    this._handleSetBackground();
  }

  shouldComponentUpdate(nextProps) {
    const {
      apolloClient,
      fetching,
      flashes,
      location,
      token,
      width
    } = this.props;

    return (
      apolloClient.id !== nextProps.apolloClient.id ||
      fetching !== nextProps.fetching ||
      width !== nextProps.width ||
      token !== nextProps.token ||
      !_isEqual(location, nextProps.location) ||
      !_isEqual(flashes, nextProps.flashes)
    );
  }

  componentDidUpdate(prevProps) {
    const { location, token } = this.props;
    const { hash, pathname } = location;

    const modal = _get(location, "state.modal", false);
    const prevModal = _get(prevProps, "location.state.modal", false);

    if (!modal && !prevModal && pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }

    if (hash.match(/sidebar/u) || hash.match(/stopwatch/u)) {
      document.addEventListener("keydown", this._handleKeyPress);
    } else {
      document.removeEventListener("keydown", this._handleKeyPress);
    }

    if (token !== prevProps.token) {
      this._handleSetBackground();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    window.removeEventListener("resize", this._handleUpdateWindow);
  }

  _handleSetBackground() {
    const { token } = this.props;

    const htmlClasses = cx("antialiased", {
      "bg-blue-lightest": !token,
      "bg-white": Boolean(token)
    });

    document.documentElement.className = htmlClasses;
  }

  _handleUpdateWindow() {
    const { location, onUpdateWindow } = this.props;

    const element = document.documentElement;

    onUpdateWindow(element.clientWidth, element.clientHeight);

    if (location.hash.match(/sidebar/u) || location.hash.match(/stopwatch/u)) {
      history.push({ ...location, hash: null, replace: true });
    }
  }

  _handleKeyPress(event) {
    const { location } = this.props;

    const sidebar =
      location.hash.match(/sidebar/u) || location.hash.match(/stopwatch/u);

    if (event.keyCode === 27 && sidebar) {
      history.push({ ...location, hash: null, replace: true });
    }
  }

  render() {
    const { apolloClient, children } = this.props;

    return (
      <>
        <ApolloProvider client={apolloClient.client}>
          {children}

          <Flashes />
        </ApolloProvider>
      </>
    );
  }
}

const props = state => {
  return {
    apolloClient: state.app.apolloClient,
    flashes: state.flashes.flashes,
    sidebar: state.app.sidebar,
    token: state.app.token,
    width: state.app.width
  };
};

const actions = {
  onLoadApp: loadApp,
  onUpdateWindow: updateWindow
};

export default withRouter(
  connect(
    props,
    actions
  )(App)
);
