import {
  ClientsStack,
  DashboardPage,
  EntriesStack,
  ProfilePage
} from 'javascripts/app/containers';
import { Redirect, Route, Switch } from 'react-router-dom';

import Header from './Header';
import LeftSidebar from './LeftSidebar';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RightSidebar from './RightSidebar';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 62px;
`;

const Content = styled.div`
  max-width: 1120px;
`;

const SignedInStack = (props) => {
  const { auth } = props;

  if (!auth) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <React.Fragment>
      <Container className="md:ml-64 transition relative overflow-auto">
        <Content className="mx-auto">
          <Switch>
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
        </Content>
      </Container>

      <Header {...props} />
      <LeftSidebar {...props} />
      <RightSidebar {...props} />
    </React.Fragment>
  );
};

SignedInStack.propTypes = {
  auth: PropTypes.auth
};

SignedInStack.defaultProps = {
  auth: null
};

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
