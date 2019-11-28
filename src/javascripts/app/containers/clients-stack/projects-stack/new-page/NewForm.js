import * as Yup from 'yup';

import { Formik } from 'formik';
import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ProjectNewForm = ({ client, onCreateProject }) => {
  const _handleSubmit = (data, actions) => {
    onCreateProject(client, data, actions);
  };

  if (!client) {
    return <h1 className="text-center text-blue">{'Client Not Found'}</h1>;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required')
  });

  return (
    <Formik
      component={ProjectForm}
      enableReinitialize
      initialValues={{ active: true, billable: true, name: '' }}
      onSubmit={_handleSubmit}
      validationSchema={validationSchema}
    />
  );
};

ProjectNewForm.propTypes = {
  client: PropTypes.client,
  onCreateProject: PropTypes.func.isRequired
};

ProjectNewForm.defaultProps = {
  client: null
};

const props = (state, ownProps) => {
  return {
    client: null // selectClient(state, ownProps.match.params.clientId)
  };
};

const actions = {};

export default connect(props, actions)(ProjectNewForm);
