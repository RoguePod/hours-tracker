import { Button, Spinner } from 'javascripts/shared/components';

import ClientRow from './ClientRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { selectAdmin } from 'javascripts/app/redux/app';
import { startEntry } from 'javascripts/app/redux/running';

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

    const clientRows = clients.map((client) => {
      return (
        <ClientRow
          {...this.props}
          client={client}
          key={client.id}
        />
      );
    });

    return (
      <div className="p-4">
        <div className="text-blue flex items-center pb-4">
          <h1 className="flex-1 text-blue">
            {'Clients/Projects'}
          </h1>
          {admin &&
            <Button
              as={Link}
              color="blue"
              to="/clients/new"
            >
              <FontAwesomeIcon
                icon="plus"
              />
              {' '}
              {'New Client'}
            </Button>}
        </div>
        {clientRows}
        <Spinner
          page
          spinning={!ready}
          text="Loading..."
        />
      </div>
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
