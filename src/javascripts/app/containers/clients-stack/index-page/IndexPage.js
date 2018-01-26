import {
  Button, Dimmer, Header, Loader, Segment, Table
} from 'semantic-ui-react';

import ClientBody from './ClientBody';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { selectAdmin } from 'javascripts/app/redux/app';
import { startEntry } from 'javascripts/app/redux/running';
import styles from './IndexPage.scss';

class ClientsIndexPage extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.client).isRequired,
    onStartEntry: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { admin, clients, ready } = this.props;

    return (
      admin !== nextProps.admin ||
      ready !== nextProps.ready ||
      !_isEqual(clients, nextProps.clients)
    );
  }

  render() {
    const { admin, clients, ready } = this.props;

    const bodies = clients.map((client) => {
      return (
        <ClientBody
          {...this.props}
          client={client}
          key={client.id}
        />
      );
    });

    return (
      <Segment
        basic
        className={styles.container}
      >
        <Header
          as="h1"
          color="blue"
        >
          {admin &&
            <Button
              as={Link}
              color="green"
              content="New Client"
              floated="right"
              icon="plus"
              to="/clients/new"
            />}
          {'Clients/Projects'}
        </Header>
        <Dimmer
          active={!ready}
          inverted
        >
          <Loader>
            {'Loading...'}
          </Loader>
        </Dimmer>
        <div className={styles.table}>
          <Table
            celled
            unstackable
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  {'Name'}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {'Active'}
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            {bodies}
          </Table>
        </div>
      </Segment>
    );
  }
}

const props = (state) => {
  return {
    admin: selectAdmin(state),
    clients: state.clients.clients,
    ready: state.recents.ready,
    recents: state.recents.recents,
    user: state.app.user
  };
};

const actions = {
  onStartEntry: startEntry
};

export default connect(props, actions)(ClientsIndexPage);
