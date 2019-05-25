/* global window,document */

import { loadApp, updateWindow } from 'javascripts/app/redux/app';

import { Flashes } from 'javascripts/shared/components';
import Loader from './Loader';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import cx from 'classnames';
import { history } from 'javascripts/app/redux/store';
import { signOutUser } from 'javascripts/app/redux/user';
import { withRouter } from 'react-router-dom';

class App extends React.Component {
  static propTypes = {
    auth: PropTypes.auth,
    children: PropTypes.node,
    clientsReady: PropTypes.bool.isRequired,
    fetching: PropTypes.bool,
    flashes: PropTypes.arrayOf(PropTypes.flash).isRequired,
    location: PropTypes.routerLocation.isRequired,
    onLoadApp: PropTypes.func.isRequired,
    onUpdateWindow: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    auth: null,
    children: null,
    fetching: false
  };

  constructor(props) {
    super(props);

    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleUpdateWindow = this._handleUpdateWindow.bind(this);
  }

  componentDidMount() {
    const { onLoadApp } = this.props;

    onLoadApp();

    window.addEventListener('resize', this._handleUpdateWindow);

    this._handleSetBackground();
  }

  shouldComponentUpdate(nextProps) {
    const {
      auth,
      clientsReady,
      fetching,
      flashes,
      location,
      ready,
      width
    } = this.props;

    return (
      ready !== nextProps.ready ||
      fetching !== nextProps.fetching ||
      width !== nextProps.width ||
      clientsReady !== nextProps.clientsReady ||
      !_isEqual(location, nextProps.location) ||
      Boolean(auth) !== Boolean(nextProps.auth) ||
      !_isEqual(flashes, nextProps.flashes)
    );
  }

  componentDidUpdate(prevProps) {
    const { auth, location } = this.props;
    const { hash, pathname } = location;

    const modal = _get(location, 'state.modal', false);
    const prevModal = _get(prevProps, 'location.state.modal', false);

    if (!modal && !prevModal && pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }

    if (hash.match(/sidebar/u) || hash.match(/stopwatch/u)) {
      document.addEventListener('keydown', this._handleKeyPress);
    } else {
      document.removeEventListener('keydown', this._handleKeyPress);
    }

    if (Boolean(auth) !== Boolean(prevProps.auth)) {
      this._handleSetBackground();
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    window.removeEventListener('resize', this._handleUpdateWindow);
  }

  _handleSetBackground() {
    const { auth } = this.props;

    const htmlClasses = cx('antialiased h-full', {
      'bg-blue-200': !auth,
      'bg-white': Boolean(auth)
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
    const { auth, children, clientsReady, ready } = this.props;

    const isReady = !(!ready || (!clientsReady && Boolean(auth)));

    return (
      <>
        {isReady && children}

        <Loader loading={!isReady} />
        <Flashes />
      </>
    );
  }
}

const props = (state) => {
  return {
    auth: state.app.auth,
    clientsReady: state.clients.ready,
    flashes: state.flashes.flashes,
    ready: state.app.ready,
    sidebar: state.app.sidebar,
    width: state.app.width
  };
};

const actions = {
  onLoadApp: loadApp,
  onSignOutUser: signOutUser,
  onUpdateWindow: updateWindow
};

export default withRouter(
  connect(
    props,
    actions
  )(App)
);
