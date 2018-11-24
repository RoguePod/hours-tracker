/* global window,document */

import { loadApp, updateWindow } from 'javascripts/app/redux/app';

import { Flashes } from 'javascripts/shared/components';
import { Helmet } from 'react-helmet';
import Loader from './Loader';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import cx from 'classnames';
import { history } from 'javascripts/app/redux/store';
import jQuery from 'jquery';
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
  }

  static defaultProps = {
    auth: null,
    children: null,
    fetching: false
  }

  constructor(props) {
    super(props);

    this._handleKeyPress = this._handleKeyPress.bind(this);
    this._handleUpdateWindow = this._handleUpdateWindow.bind(this);
  }

  componentDidMount() {
    const { onLoadApp } = this.props;

    onLoadApp();

    window.addEventListener('resize', this._handleUpdateWindow);
  }

  shouldComponentUpdate(nextProps) {
    const {
      auth, clientsReady, fetching, flashes, location, ready, width
    } = this.props;

    return (
      ready !== nextProps.ready ||
      fetching !== nextProps.fetching ||
      width !== nextProps.width ||
      clientsReady !== nextProps.clientsReady ||
      !_isEqual(location, nextProps.location) ||
      !_isEqual(auth, nextProps.auth) ||
      !_isEqual(flashes, nextProps.flashes)
    );
  }

  componentDidUpdate(prevProps) {
    const { location: { hash, pathname } } = this.props;

    if (pathname !== prevProps.location.pathname) {
      jQuery('html, body').animate({ scrollTop: 0 }, 150);
    }

    if (hash.match(/sidebar/u) || hash.match(/stopwatch/u)) {
      document.addEventListener('keydown', this._handleKeyPress);
    } else {
      document.removeEventListener('keydown', this._handleKeyPress);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    window.addEventListener('resize', this._handleUpdateWindow);
  }

  _handleUpdateWindow() {
    const { location, onUpdateWindow } = this.props;

    const element = document.documentElement;

    onUpdateWindow(element.clientWidth, element.clientHeight);

    if (location.hash.match(/sidebar/u) ||
        location.hash.match(/stopwatch/u)) {
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
    const {
      auth, children, clientsReady, ready
    } = this.props;

    const isReady = !(!ready || (!clientsReady && auth));

    const htmlClasses = cx('antialiased', {
      'bg-blue-lightest': !auth,
      'bg-white': auth
    });

    return (
      <React.Fragment>
        <Helmet>
          <html className={htmlClasses} />
        </Helmet>

        {isReady && children}

        <Loader
          loading={!isReady}
        />
        <Flashes />
      </React.Fragment>
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

export default withRouter(connect(props, actions)(App));
