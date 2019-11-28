import * as Yup from 'yup';

import ForgotPasswordForm from './ForgotPasswordForm';
import { Formik } from 'formik';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { addFlash } from 'javascripts/shared/redux/flashes';
import gql from 'graphql-tag';
import { serverErrors } from 'javascripts/globals';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

const MUTATION = gql`
  mutation UserForgotPassword($email: String!) {
    userForgotPassword(email: $email) {
      email
    }
  }
`;

const ForgotPasswordPage = () => {
  const history = useHistory();
  const [onSubmit] = useMutation(MUTATION);
  const dispatch = useDispatch();

  const _handleSubmit = (variables, actions) => {
    return onSubmit({ variables })
      .then(() => {
        dispatch(addFlash('Reset Password Instructions sent!'));
        history.push('/sign-in');
      })
      .catch((error) => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Must be a valid Email')
      .required('Email is Required')
  });

  const initialValues = {
    email: ''
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue pb-4">{'Forgot Password?'}</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={_handleSubmit}
        render={ForgotPasswordForm}
        validationSchema={validationSchema}
      />
    </div>
  );
};

ForgotPasswordPage.propTypes = {};

export default React.memo(ForgotPasswordPage);
