import * as Yup from 'yup';

import { Formik } from 'formik';
import ProjectForm from '../ProjectForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';

const ProjectEditForm = ({ onUpdateProject, project }) => {
  const _handleSubmit = (data, actions) => {
    onUpdateProject(project, data, actions);
  };

  if (!project) {
    return <h1 className="text-center text-blue">{'Project Not Found'}</h1>;
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required')
  });

  const initialValues = {
    active: project.active,
    billable: project.billable,
    name: project.name
  };

  return (
    <Formik
      component={ProjectForm}
      enableReinitialize
      initialValues={initialValues}
      onSubmit={_handleSubmit}
      validationSchema={validationSchema}
    />
  );
};

ProjectEditForm.propTypes = {
  onUpdateProject: PropTypes.func.isRequired,
  project: PropTypes.project
};

ProjectEditForm.defaultProps = {
  project: null
};

const props = (state, ownProps) => {
  return {
    project: null
    // selectProject(state, match.params.clientId, match.params.id)
  };
};

const actions = {};

export default connect(props, actions)(ProjectEditForm);
