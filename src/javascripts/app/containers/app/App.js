import { Dimmer, Loader } from 'semantic-ui-react';
import { loadApp, openSidebar, updateWindow } from 'javascripts/app/redux/app';

import { Flashes } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import cx from 'classnames';
import { history } from 'javascripts/app/redux/store';
import jQuery from 'jquery';
import { removeFlash } from 'javascripts/shared/redux/flashes';
import { signOutUser } from 'javascripts/app/redux/user';
import styles from './App.scss';
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
    onRemoveFlash: PropTypes.func.isRequired,
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

    /* eslint-disable no-undef */
    window.addEventListener('resize', this._handleUpdateWindow);
    /* eslint-enable no-undef */
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;

    if (location.pathname !== nextProps.location.pathname) {
      // if (location.pathname.startsWith('/profile') &&
      //     nextProps.location.pathname.startsWith('/profile')) {
      //   return;
      // }

      jQuery('html, body').animate({ scrollTop: 0 }, 150);
    }
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

  componentWillUpdate(nextProps) {
    /* eslint-disable no-undef */
    if (nextProps.location.hash.match(/sidebar/)) {
      document.addEventListener('keydown', this._handleKeyPress);
    } else {
      document.removeEventListener('keydown', this._handleKeyPress);
    }
    /* eslint-enable no-undef */
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    /* eslint-disable no-undef */
    window.addEventListener('resize', this._handleUpdateWindow);
    /* eslint-enable no-undef */
  }

  _handleUpdateWindow() {
    const { location, onUpdateWindow } = this.props;

    /* eslint-disable no-undef */
    const element = document.documentElement;
    /* eslint-enable no-undef */

    onUpdateWindow(element.clientWidth, element.clientHeight);

    if (location.hash.match(/sidebar/)) {
      history.push({ ...location, hash: null });
    }
  }

  _handleKeyPress(event) {
    const { location } = this.props;

    if (event.keyCode === 27 && location.hash.match(/sidebar/)) {
      history.push({ ...location, hash: null });
    }
  }

  render() {
    const {
      auth, children, clientsReady, fetching, flashes, onRemoveFlash, ready
    } = this.props;

    if (!ready || (!clientsReady && auth)) {
      return (
        <div className={styles.container}>
          <Dimmer
            active
            inverted
          >
            <Loader>
              {'Getting everything ready...'}
            </Loader>
          </Dimmer>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={cx(styles.content, { [styles.signedOut]: !auth })}>
          {children}
        </div>

        <Dimmer
          active={fetching}
          inverted
        >
          <Loader />
        </Dimmer>
        <Flashes
          flashes={flashes}
          onRemoveFlash={onRemoveFlash}
        />
      </div>
    );
  }
}

const props = (state) => {
  return {
    auth: state.app.auth,
    clientsReady: state.clients.ready,
    fetching: state.fetching.fetching.length > 0,
    flashes: state.flashes.flashes,
    ready: state.app.ready,
    sidebar: state.app.sidebar,
    width: state.app.width
  };
};

const actions = {
  onLoadApp: loadApp,
  onOpenSidebar: openSidebar,
  onRemoveFlash: removeFlash,
  onSignOutUser: signOutUser,
  onUpdateWindow: updateWindow
};

export default withRouter(connect(props, actions)(App));
