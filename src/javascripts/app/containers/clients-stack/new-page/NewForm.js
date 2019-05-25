import * as Yup from 'yup';

import ClientForm from '../ClientForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createClient } from 'javascripts/app/redux/clients';

const ClientNewForm = ({ onCreateClient }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required')
  });

  return (
    <Formik
      component={ClientForm}
      initialValues={{ active: true, name: '' }}
      onSubmit={onCreateClient}
      validationSchema={validationSchema}
    />
  );
};

ClientNewForm.propTypes = {
  onCreateClient: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onCreateClient: createClient
};

export default connect(
  props,
  actions
)(ClientNewForm);
