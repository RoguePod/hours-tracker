import * as Yup from 'yup';

import ForgotPasswordForm from './ForgotPasswordForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { forgotPassword } from 'javascripts/app/redux/passwords';

const ForgotPasswordPage = ({ onForgotPassword }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid Email')
      .required('Email is Required')
  });

  const initialValues = {
    email: ''
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue pb-4">
        {'Forgot Password?'}
      </h2>

      <Formik
        initialValues={initialValues}
        onSubmit={onForgotPassword}
        render={ForgotPasswordForm}
        validationSchema={validationSchema}
      />
    </div>
  );
};

ForgotPasswordPage.propTypes = {
  onForgotPassword: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onForgotPassword: forgotPassword
};

export default connect(props, actions)(ForgotPasswordPage);
