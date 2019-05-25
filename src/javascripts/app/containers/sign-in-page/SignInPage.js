import * as Yup from 'yup';

import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SignInForm from './SignInForm';
import { connect } from 'react-redux';
import { signInUser } from 'javascripts/app/redux/user';

const SignInPage = ({ onSignInUser }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Must be a valid Email')
      .required('Email is Required'),
    password: Yup.string().required('Password is Required')
  });

  const initialValues = {
    email: '',
    password: ''
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue-500 pb-4">{'Sign In'}</h2>

      <Formik
        initialValues={initialValues}
        onSubmit={onSignInUser}
        render={SignInForm}
        validationSchema={validationSchema}
      />
    </div>
  );
};

SignInPage.propTypes = {
  onSignInUser: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onSignInUser: signInUser
};

export default connect(
  props,
  actions
)(SignInPage);
