import { Button, Pagination, Spinner } from 'javascripts/shared/components';
import {
  selectPaginatedClients,
  selectQuery
} from 'javascripts/app/redux/clients';

import ClientRow from './ClientRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SearchForm from './SearchForm';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { selectAdmin } from 'javascripts/app/redux/app';
import { startEntry } from 'javascripts/app/redux/running';

class ClientsIndexPage extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    clients: PropTypes.arrayOf(PropTypes.client).isRequired,
    onStartEntry: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    ready: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { admin, clients, pagination, query, ready } = this.props;

    return (
      admin !== nextProps.admin ||
      ready !== nextProps.ready ||
      !_isEqual(query, nextProps.query) ||
      !_isEqual(clients, nextProps.clients) ||
      !_isEqual(pagination, nextProps.pagination)
    );
  }

  render() {
    const { admin, clients, pagination, query, ready } = this.props;

    const clientRows = clients.map((client) => {
      return (
        <div
          className="flex w-full xl:w-1/2 px-2"
          key={client.id}
        >
          <ClientRow
            {...this.props}
            client={client}
          />
        </div>
      );
    });

    return (
      <div className="p-4">
        <div className="text-blue flex items-center pb-4">
          <h1 className="flex-1 text-blue">
            {'Clients'}
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
        <div className="border rounded p-4 mb-4">
          <SearchForm
            {...this.props}
            enableReinitialize
            initialValues={query}
          />
        </div>
        <div className="flex -mx-2 flex-wrap">
          {clientRows}
        </div>
        <Pagination
          pagination={pagination}
        />
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
  const { clients, pagination } = selectPaginatedClients(state);

  return {
    admin: selectAdmin(state),
    clients,
    pagination,
    query: selectQuery(state),
    ready: state.recents.ready,
    recents: state.recents.recents,
    user: state.app.user
  };
};

const actions = {
  onStartEntry: startEntry
};

export default connect(props, actions)(ClientsIndexPage);
