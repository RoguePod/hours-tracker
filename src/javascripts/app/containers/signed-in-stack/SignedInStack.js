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
import { HEADER_HEIGHT, SignedInContext } from "javascripts/globals";
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
      id
      name
    }

    entryRunning {
      id
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
  subscription EntryRunning {
    entryRunning {
      id
    }
  }
`;

class SignedInStack extends React.Component {
  static propTypes = {
    auth: PropTypes.auth,
    history: PropTypes.routerHistory.isRequired,
    location: PropTypes.routerLocation.isRequired,
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
    const { location, token } = this.props;
    const { open, modalLocation, location: previousLocation } = this.state;

    if (!token) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <Query query={QUERY}>
        {query => {
          console.log(1, query)
          const { data, loading } = query;

          return (
            <SignedInContext.Provider value={data || {}}>
              <Container className="md:ml-64 relative overflow-auto">
                <Content className="mx-auto">
                  <Switch location={open ? previousLocation : location}>
                    {/* <Route component={ClientsStack} path="/clients" />
                    <Route component={EntriesStack} path="/entries" />
                    <Route component={ProfilePage} path="/profile" />
                    <Route component={DashboardPage} exact path="/" /> */}
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

              <Header {...this.props} />
              <LeftSidebar {...this.props} />
              <RightSidebar {...this.props} />
              <Spinner size={75} spinning={loading} text="Hours Tracker" />
            </SignedInContext.Provider>
          );
        }}
      </Query>
    );
  }
}

const props = state => {
  return {
    running: Boolean(state.running.entry),
    token: state.app.token,
    width: state.app.width
  };
};

const actions = {};

export default connect(
  props,
  actions
)(SignedInStack);
