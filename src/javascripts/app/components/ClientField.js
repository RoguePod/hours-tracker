import { AutoCompleteField } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import gql from 'graphql-tag';

const CLIENTS_QUERY = gql`
  query ClientFieldQuery($query: String!) {
    clientsIndex(query: $query) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

const CLIENT_QUERY = gql`
  query ClientFieldQuery($id: ID!) {
    clientsShow(id: $id) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

const ClientField = (props) => {
  return (
    <AutoCompleteField
      {...props}
      defaultPath="clientsShow"
      defaultQuery={CLIENT_QUERY}
      searchPath="clientsIndex"
      searchQuery={CLIENTS_QUERY}
    />
  );
};

ClientField.propTypes = {
  field: PropTypes.formikField.isRequired
};

export default ClientField;
