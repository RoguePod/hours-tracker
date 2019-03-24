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
} from "javascripts/app/containers";
import { HEADER_HEIGHT, isBlank } from "javascripts/globals";
import { Modal, Spinner, Transition } from "javascripts/shared/components";
import { Query, Subscription } from "react-apollo";
import { Redirect, Route, Switch } from "react-router-dom";

import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import { NoMatchPage } from "javascripts/shared/containers";
import PropTypes from "javascripts/prop-types";
import React from "react";
import RightSidebar from "./RightSidebar";
import _get from "lodash/get";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { history } from "javascripts/app/redux/store";
import styled from "styled-components";

const LG_SIZE = "1120px";

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

    clientsIndex {
      active
      id
      name

      projects {
        active
        billable
        id
        name
      }
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription EntryRunningSubscription {
    entryRunningSubscription {
      description
      id
      projectId
      startedAt
      timezone
    }
  }
`;

class SignedInStack extends React.Component {
  static propTypes = {
    auth: PropTypes.auth,
    query: PropTypes.query.isRequired,
    history: PropTypes.routerHistory.isRequired,
    location: PropTypes.routerLocation.isRequired,
    running: PropTypes.bool.isRequired,
    token: PropTypes.string
  };

  static defaultProps = {
    auth: null,
    token: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      history: { action }
    } = nextProps;
    const modal = _get(nextProps, "location.state.modal", false);

    if (action !== "POP" && modal) {
      return { modalLocation: nextProps.location, open: true };
    } else if (action === "POP" && prevState.open) {
      return { location: nextProps.location, open: false };
    }

    return { location: nextProps.location };
  }

  constructor(props) {
    super(props);

    const { location } = props;

    this.state = {
      location,
      open: false
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null;

  render() {
    const {
      location,
      query: { data, error, loading },
      running,
      token
    } = this.props;
    const { open, modalLocation, location: previousLocation } = this.state;

    if (!token) {
      return <Redirect to="/sign-in" />;
    } else if (!loading && error) {
      return <Redirect to="/sign-out" />;
    }

    const name = _get(data, "userSession.name");
    const isReady = !loading && !isBlank(name);

    return (
      <>
        {isReady && (
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

            <Header {...this.props} name={name} running={running} />
            <LeftSidebar {...this.props} />
            <RightSidebar {...this.props} />
          </>
        )}
        <Spinner size={75} spinning={loading} text="Hours Tracker" />
      </>
    );
  }
}

const props = state => {
  return {
    token: state.app.token,
    width: state.app.width
  };
};

const actions = {};

const SignedInStackComponent = connect(
  props,
  actions
)(SignedInStack);

const SignedInStackSubscription = props => {
  return (
    <Subscription subscription={SUBSCRIPTION}>
      {subscription => {
        let entry = _get(props, "query.data.entryRunning");

        if (!subscription.loading) {
          entry = _get(subscription, "data.entryRunningSubscription");
        }

        return (
          <SignedInStackComponent
            {...props}
            running={Boolean(entry)}
            subscription={subscription}
          />
        );
      }}
    </Subscription>
  );
};

const SignedInStackQuery = props => {
  return (
    <Query query={QUERY}>
      {query => {
        return <SignedInStackSubscription {...props} query={query} />;
      }}
    </Query>
  );
};

export default SignedInStackQuery;
