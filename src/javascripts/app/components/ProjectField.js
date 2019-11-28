import { AutoCompleteField } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import gql from 'graphql-tag';

const PROJECTS_QUERY = gql`
  query ProjectFieldQuery($query: String!) {
    projectsIndex(query: $query) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

const PROJECT_QUERY = gql`
  query ProjectFieldQuery($id: ID!) {
    projectsShow(id: $id) {
      id
      name

      client {
        id
        name
      }
    }
  }
`;

const ProjectField = (props) => {
  return (
    <AutoCompleteField
      {...props}
      defaultPath="projectsShow"
      defaultQuery={PROJECT_QUERY}
      searchPath="projectsIndex"
      searchQuery={PROJECTS_QUERY}
    />
  );
};

ProjectField.propTypes = {
  field: PropTypes.formikField.isRequired
};

export default ProjectField;
