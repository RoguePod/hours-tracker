import {
  ClientEditModal,
  ClientNewModal,
  ClientsStack,
  DashboardPage,
  EntriesStack,
  EntryEditModal,
  EntryEditMultipleModal,
  EntryNewModal,
  ProfilePage,
  ProjectEditModal,
  ProjectNewModal
} from 'javascripts/app/containers';
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { Modal } from 'javascripts/shared/components';
import { NoMatchPage } from 'javascripts/shared/containers';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RightSidebar from './RightSidebar';
import _get from 'lodash/get';
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
    history: PropTypes.routerHistory.isRequired,
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
      return { modalLocation: nextProps.location, open: true };
    } else if (action === 'POP' && prevState.open) {
      return { location: nextProps.location, open: false };
    }

    return { location: nextProps.location };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null

  render() {
    const { auth, location } = this.props;
    const { open, modalLocation, location: previousLocation } = this.state;

    if (!auth) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <>
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
              <Route
                component={NoMatchPage}
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
                  component={ClientNewModal}
                  path="/clients/new"
                />
                <Route
                  component={ProjectNewModal}
                  path="/clients/:clientId/projects/new"
                />
                <Route
                  component={ProjectEditModal}
                  path="/clients/:clientId/projects/:id"
                />
                <Route
                  component={ClientEditModal}
                  path="/clients/:id"
                />
                <Route
                  component={EntryNewModal}
                  path="/entries/new"
                />
                <Route
                  component={EntryEditMultipleModal}
                  path="/entries/edit"
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
      </>
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
