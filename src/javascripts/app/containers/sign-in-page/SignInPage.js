import * as Yup from 'yup';

import { Formik } from 'formik';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SignInForm from './SignInForm';
import _get from 'lodash/get';
import { addFlash } from 'javascripts/shared/redux/flashes';
import gql from 'graphql-tag';
import { serverErrors } from 'javascripts/globals';
import { signInUser } from 'javascripts/shared/redux/app';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';

const MUTATION = gql`
  mutation UserSignIn($email: String!, $password: String!) {
    userSignIn(email: $email, password: $password) {
      token
    }
  }
`;

const SignInPage = () => {
  const [onSubmit] = useMutation(MUTATION);
  const dispatch = useDispatch();

  const _handleSubmit = (variables, actions) => {
    return onSubmit({ variables })
      .then((response) => {
        const token = _get(response, 'data.userSignIn.token');
        dispatch(signInUser(token));
        dispatch(addFlash('Sign In Successful!'));
      })
      .catch((error) => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Must be a valid Email')
      .required('Email is Required'),
    password: Yup.string().required('Password is Required')
  });

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue-500 pb-4">{'Sign In'}</h2>
      <Formik
        component={SignInForm}
        initialValues={initialValues}
        onSubmit={_handleSubmit}
        validationSchema={validationSchema}
      />
    </div>
  );
};

SignInPage.propTypes = {};

export default SignInPage;
