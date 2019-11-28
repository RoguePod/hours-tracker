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
import { HEADER_HEIGHT, isBlank } from 'javascripts/globals';
import { Modal, Spinner, Transition } from 'javascripts/shared/components';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation
} from 'react-router-dom';

import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { NoMatchPage } from 'javascripts/shared/containers';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RightSidebar from './RightSidebar';
import _get from 'lodash/get';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { useModalRoute } from 'javascripts/shared/hooks';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

const LG_SIZE = '1120px';

const Container = styled(Transition)`
  margin-top: ${HEADER_HEIGHT};
`;

const Content = styled.div`
  max-width: ${LG_SIZE};
`;

const QUERY = gql`
  query SignedIn {
    userSession {
      autoloadLastDescription
      id
      name
      recentProjectsListSize
      recentProjectsSort
      role
      timezone
    }

    entryRunning {
      description
      id
      projectId
      startedAt
      timezone
    }
  }
`;

// const SUBSCRIPTION = gql`
//   subscription EntryRunningSubscription {
//     entryRunningSubscription {
//       description
//       id
//       projectId
//       startedAt
//       timezone
//     }
//   }
// `;

const SignedInStack = () => {
  // const subscription = useSubscription(SUBSCRIPTION);
  const { data, error, loading } = useQuery(QUERY);

  const timer = React.useRef(null);
  const history = useHistory();
  const location = useLocation();
  const { modalLocation, open, pageLocation } = useModalRoute(
    history,
    location
  );

  const { token } = useSelector((state) => ({
    token: state.app.token
  }));

  React.useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  if (!token) {
    return <Redirect to="/sign-in" />;
  } else if (!loading && error) {
    return <Redirect to="/sign-out" />;
  }

  const name = _get(data, 'userSession.name');
  const isReady = !loading && !isBlank(name);

  return (
    <>
      {isReady && (
        <>
          <Container className="md:ml-64 relative overflow-auto">
            <Content className="mx-auto">
              <Switch location={pageLocation}>
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
                  <Route
                    component={EntryEditMultipleModal}
                    path="/entries/edit"
                  />
                  <Route component={EntryEditModal} path="/entries/:id/edit" />
                </Switch>
              </Modal>
            </Content>
          </Container>

          <Header name={name} running />
          <LeftSidebar />
          <RightSidebar />
        </>
      )}
      <Spinner size={75} spinning={loading} text="Hours Tracker" />
    </>
  );
};

SignedInStack.propTypes = {};

SignedInStack.defaultProps = {};

export default React.memo(SignedInStack);
