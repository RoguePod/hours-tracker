import { AutoCompleteField } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import gql from 'graphql-tag';

const USERS_QUERY = gql`
  query UserFieldQuery($query: String!) {
    usersIndex(query: $query) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

const USER_QUERY = gql`
  query UserFieldQuery($id: ID!) {
    usersShow(id: $id) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

const UserField = (props) => {
  return (
    <AutoCompleteField
      {...props}
      defaultPath="usersShow"
      defaultQuery={USER_QUERY}
      searchPath="usersIndex"
      searchQuery={USERS_QUERY}
    />
  );
};

UserField.propTypes = {
  field: PropTypes.formikField.isRequired
};

export default UserField;
