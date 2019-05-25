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
import { Modal, Transition } from 'javascripts/shared/components';
import { Redirect, Route, Switch } from 'react-router-dom';

import { HEADER_HEIGHT } from 'javascripts/globals';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { NoMatchPage } from 'javascripts/shared/containers';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RightSidebar from './RightSidebar';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import styled from 'styled-components';
import update from 'immutability-helper';

const LG_SIZE = '1120px';

const Container = styled(Transition)`
  margin-top: ${HEADER_HEIGHT};
`;

const Content = styled.div`
  max-width: ${LG_SIZE};
`;

const path = 'SignedInRoutes';
const CLOSE_MODAL = `${path}/CLOSE_MODAL`;
const OPEN_MODAL = `${path}/OPEN_MODAL`;
const RESET_LOCATION = `${path}/RESET_LOCATION`;

const reducer = (state, action) => {
  switch (action.type) {
    case CLOSE_MODAL:
      return update(state, {
        previousLocation: { $set: action.previousLocation },
        open: { $set: action.open }
      });
    case OPEN_MODAL:
      return update(state, {
        modalLocation: { $set: action.modalLocation },
        open: { $set: action.open }
      });
    case RESET_LOCATION:
      return update(state, {
        previousLocation: { $set: action.previousLocation }
      });
    default:
      throw new Error();
  }
};

const SignedInStack = ({ auth, history, location, running, user, width }) => {
  if (!auth) {
    return <Redirect to="/sign-in" />;
  }

  const [state, dispatch] = React.useReducer(reducer, {
    modalLocation: null,
    open: false,
    previousLocation: location
  });
  const { open, modalLocation, previousLocation } = state;
  const { action } = history;
  const modal = _get(location, 'state.modal', false);

  if (action !== 'POP' && modal && !_isEqual(location, modalLocation)) {
    dispatch({ modalLocation: location, open: true, type: OPEN_MODAL });
  } else if (action === 'POP' && open) {
    dispatch({ previousLocation: location, open: false, type: CLOSE_MODAL });
  }

  return (
    <>
      <Container className="md:ml-64 relative overflow-auto">
        <Content className="mx-auto">
          <Switch location={open ? previousLocation : location}>
            <Route component={ClientsStack} path="/clients" />
            <Route component={EntriesStack} path="/entries" />
            <Route component={ProfilePage} path="/profile" />
            <Route component={DashboardPage} exact path="/" />
            <Route component={NoMatchPage} />
          </Switch>
          <Modal onClose={history.goBack} open={open}>
            <Switch location={modalLocation}>
              <Route component={ClientNewModal} path="/clients/new" />
              <Route
                component={ProjectNewModal}
                path="/clients/:clientId/projects/new"
              />
              <Route
                component={ProjectEditModal}
                path="/clients/:clientId/projects/:id"
              />
              <Route component={ClientEditModal} path="/clients/:id" />
              <Route component={EntryNewModal} path="/entries/new" />
              <Route component={EntryEditMultipleModal} path="/entries/edit" />
              <Route component={EntryEditModal} path="/entries/:id/edit" />
            </Switch>
          </Modal>
        </Content>
      </Container>

      <Header location={location} running={running} user={user} />
      <LeftSidebar location={location} width={width} />
      <RightSidebar location={location} />
    </>
  );
};

SignedInStack.propTypes = {
  auth: PropTypes.auth,
  history: PropTypes.routerHistory.isRequired,
  location: PropTypes.routerLocation.isRequired,
  running: PropTypes.bool.isRequired,
  user: PropTypes.user,
  width: PropTypes.number.isRequired
};

SignedInStack.defaultProps = {
  auth: null,
  user: null
};

const props = (state) => {
  return {
    auth: state.app.auth,
    running: Boolean(state.running.entry),
    user: state.app.user,
    width: state.app.width
  };
};

const actions = {};

export default connect(
  props,
  actions
)(SignedInStack);
