import {
  ClientsStack,
  DashboardPage,
  EntriesStack,
  EntryEditModal,
  EntryNewModal,
  ProfilePage
} from 'javascripts/app/containers';
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { Modal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RightSidebar from './RightSidebar';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { history } from 'javascripts/app/redux/store';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 62px;
`;

const Content = styled.div`
  max-width: 1120px;
`;

class SignedInStack extends React.Component {
  static propTypes = {
    auth: PropTypes.auth,
    location: PropTypes.routerLocation.isRequired
  }

  static defaultProps = {
    auth: null
  }

  constructor(props) {
    super(props);

    const { location } = props;

    this.state = {
      location,
      open: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { history: { action } } = nextProps;
    const modal = _get(nextProps, 'location.state.modal', false);

    if (action !== 'POP' && modal) {
      return { open: true };
    } else if (action === 'POP' && prevState.open) {
      return { open: false };
    }

    return null;
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { location: stateLocation, open, modal } = this.state;

    if (!_isEqual(prevProps.location, location)) {
      if (open && !_isEqual(modal, location)) {
        this.setState({ modal: location });
      }

      if (!open && !_isEqual(stateLocation, location)) {
        this.setState({ location });
      }
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null

  render() {
    const { auth, location } = this.props;
    const {
      open, location: previousLocation, modal: modalLocation
    } = this.state;

    if (!auth) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <React.Fragment>
        <Container className="md:ml-64 transition relative overflow-auto">
          <Content className="mx-auto">
            <Switch
              location={open ? previousLocation : location}
            >
              <Route
                component={ClientsStack}
                path="/clients"
              />
              <Route
                component={EntriesStack}
                path="/entries"
              />
              <Route
                component={ProfilePage}
                path="/profile"
              />
              <Route
                component={DashboardPage}
                exact
                path="/"
              />
            </Switch>
            <Modal
              onClose={history.goBack}
              open={open}
            >
              <Switch
                location={modalLocation}
              >
                <Route
                  component={EntryNewModal}
                  path="/entries/new"
                />
                <Route
                  component={EntryEditModal}
                  path="/entries/:id/edit"
                />
              </Switch>
            </Modal>
          </Content>
        </Container>

        <Header {...this.props} />
        <LeftSidebar {...this.props} />
        <RightSidebar {...this.props} />
      </React.Fragment>
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
