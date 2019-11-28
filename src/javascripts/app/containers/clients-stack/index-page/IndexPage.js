import { Button, Pagination, Spinner } from 'javascripts/shared/components';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { fromQuery, toQuery } from 'javascripts/globals';

import ClientRow from './ClientRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SearchForm from './SearchForm';
import _compact from 'lodash/compact';
import _get from 'lodash/get';
import _pick from 'lodash/pick';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

const QUERY = gql`
  query ClientsIndex($page: Int, $pageSize: Int) {
    clientsIndex(page: $page, pageSize: $pageSize) {
      entries {
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

      pageNumber
      pageSize
      totalEntries
      totalPages
    }

    userSession {
      id
      role
    }
  }
`;

const ClientsIndexPage = () => {
  const location = useLocation();
  const history = useHistory();
  const { search } = useSelector((state) => ({}));
  const { data, loading } = useQuery(QUERY, { variables: search });

  const admin = _get(data, 'userSession.role', 'User') === 'Admin';
  const clientsIndex = _get(data, 'clientsIndex', {});
  const clients = _get(clientsIndex, 'entries', []);
  const pagination = _pick(clientsIndex, [
    'pageNumber',
    'pageSize',
    'totalEntries',
    'totalPages'
  ]);

  const _handleClear = () => {
    const { search, ...rest } = location;

    history.replace(rest);
  };

  const _handleSubmit = (data, actions) => {
    const { search } = location;

    const values = _compact(Object.values(data));

    if (values.length > 0) {
      const route = {
        ...location,
        search: toQuery({ ...fromQuery(search), ...data, page: 1 })
      };

      history.push(route);
    } else {
      _handleClear();
    }

    actions.setSubmitting(false);
  };

  const _renderForm = (props) => {
    return <SearchForm {...props} onClear={_handleClear} />;
  };

  const clientRows = clients.map((client) => {
    return (
      <div className="flex w-full xl:w-1/2 px-2" key={client.id}>
        <ClientRow admin={admin} client={client} />
      </div>
    );
  });

  return (
    <div className="p-4">
      <div className="text-blue flex items-center pb-4">
        <h1 className="flex-1 text-blue">{'Clients'}</h1>
        {admin && (
          <Button
            as={Link}
            color="blue"
            to={{
              ...location,
              pathname: '/clients/new',
              state: { modal: true }
            }}
          >
            <FontAwesomeIcon icon="plus" /> {'New Client'}
          </Button>
        )}
      </div>
      <div className="border rounded p-4 mb-4">
        <Formik
          enableReinitialize
          initialValues={search}
          onSubmit={_handleSubmit}
          render={_renderForm}
        />
      </div>
      <div className="flex -mx-2 flex-wrap">{clientRows}</div>
      <Pagination pagination={pagination} />
      <Spinner page spinning={loading} text="Loading..." />
    </div>
  );
};

ClientsIndexPage.propTypes = {};

export default React.memo(ClientsIndexPage);
