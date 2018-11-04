import { RecentsList, StopWatch } from 'javascripts/app/containers';

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
import styled from 'styled-components';

const Container = styled.div`
  height: auto;
  min-height: 100%;
`;

const Content = styled.div`
  padding-top: 62px;
`;

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

    if (!auth) {
      return <Redirect to="/sign-in" />;
    }

    // const hideStopWatch = width < 768;

    // const overlayClasses = cx(
    //   styles.overlay, { [styles.overlayOpen]: hash.match(/stopwatch/u) }
    // );

    // let sliderClasses = styles.stopwatch;

    // if (hideStopWatch) {
    //   sliderClasses = cx(
    //     styles.slider, { [styles.sliderOpen]: hash.match(/stopwatch/u) }
    //   );
    // }

    return (
      <Container className="flex flex-col">
        <Header {...this.props} />

        <Content className="flex flex-1">
          <div className="w-80 hidden md:block">
            <StopWatch />
            {/* <RecentsList /> */}
          </div>
          <div className="flex-1 container mx-auto">
            <Routes {...this.props} />
          </div>
        </Content>

        <Sidebar {...this.props} />
      </Container>
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
