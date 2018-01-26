import { RecentsList, StopWatch } from 'javascripts/app/containers';

import { Container } from 'semantic-ui-react';
import Header from './Header';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Routes from './Routes';
import Sidebar from './Sidebar';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import cx from 'classnames';
import { history } from 'javascripts/app/redux/store';
import styles from './SignedInStack.scss';

class SignedInStack extends React.Component {
  static propTypes = {
    auth: PropTypes.auth,
    location: PropTypes.routerLocation.isRequired,
    running: PropTypes.entry,
    user: PropTypes.user.isRequired,
    width: PropTypes.number.isRequired
  }

  static defaultProps = {
    auth: null,
    running: null
  }

  constructor(props) {
    super(props);

    this._handleClose = this._handleClose.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { auth, location, running, user, width } = this.props;

    return (
      width !== nextProps.width ||
      user.name !== nextProps.user.name ||
      running !== nextProps.running ||
      !_isEqual(location, nextProps.location) ||
      !_isEqual(auth, nextProps.auth)
    );
  }

  _handleClose() {
    const { location } = this.props;

    history.push({ ...location, hash: null });
  }

  render() {
    const { auth, location, width } = this.props;
    const { hash } = location;

    if (!auth) {
      return (
        <Redirect to="/sign-in" />
      );
    }

    const hideStopWatch = width < 768;

    const overlayClasses = cx(
      styles.overlay, { [styles.overlayOpen]: hash.match(/stopwatch/) }
    );

    let sliderClasses = styles.stopwatch;

    if (hideStopWatch) {
      sliderClasses = cx(
        styles.slider, { [styles.sliderOpen]: hash.match(/stopwatch/) }
      );
    }

    return (
      <div className={styles.container}>
        <Header
          {...this.props}
        />

        <div className={styles.content}>
          {hideStopWatch &&
            <div
              className={overlayClasses}
              onClick={this._handleClose}
            />}
          <div className={sliderClasses}>
            <StopWatch />
            <RecentsList />
          </div>
          <div className={cx(styles.main, { [styles.offset]: !hideStopWatch })}>
            <Container>
              <Routes {...this.props} />
            </Container>
          </div>
        </div>

        <Sidebar
          {...this.props}
        />
      </div>
    );
  }
}

const props = (state) => {
  return {
    auth: state.app.auth,
    running: state.running.entry,
    user: state.app.user,
    width: state.app.width
  };
};

const actions = {};

export default connect(props, actions)(SignedInStack);
