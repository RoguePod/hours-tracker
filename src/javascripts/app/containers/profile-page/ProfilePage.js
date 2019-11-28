import * as Yup from 'yup';

import { useMutation, useQuery } from '@apollo/react-hooks';

import { Formik } from 'formik';
import PasswordForm from './PasswordForm';
import ProfileForm from './ProfileForm';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import { addFlash } from 'javascripts/shared/redux/flashes';
import gql from 'graphql-tag';
import { serverErrors } from 'javascripts/globals';
import { useDispatch } from 'react-redux';

const QUERY = gql`
  query UserSession {
    userSession {
      autoloadLastDescription
      id
      name
      recentProjectsListSize
      recentProjectsSort
      timezone
    }
  }
`;

const PROFILE_MUTATION = gql`
  mutation UserUpdate(
    $autoloadLastDescription: Boolean!
    $name: String!
    $recentProjectsListSize: Int!
    $recentProjectsSort: String!
    $timezone: String!
  ) {
    userUpdate(
      autoloadLastDescription: $autoloadLastDescription
      name: $name
      recentProjectsListSize: $recentProjectsListSize
      recentProjectsSort: $recentProjectsSort
      timezone: $timezone
    ) {
      autoloadLastDescription
      id
      name
      recentProjectsListSize
      recentProjectsSort
      timezone
    }
  }
`;

const PASSWORD_MUTATION = gql`
  mutation UserPassword($password: String!) {
    userPassword(password: $password) {
      id
    }
  }
`;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [onUpdateProfile] = useMutation(PROFILE_MUTATION);
  const [onUpdatePassword] = useMutation(PASSWORD_MUTATION);
  const { data } = useQuery(QUERY);
  const user = _get(data, 'userSession');
  const id = _get(user, 'id');

  const initialValues = _omit(user, 'id');

  const profileValidationSchema = Yup.object().shape({
    autoloadLastDescription: Yup.boolean(),
    name: Yup.string().required('Name is Required'),
    recentProjectsListSize: Yup.number().required(
      'Recent Projects List Size is Required'
    ),
    recentProjectsSort: Yup.string().required(
      'Recent Projects Sort is Required'
    ),
    timezone: Yup.string().required('Timezone is Required')
  });

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string().required('Password is Required')
  });

  const _handleProfileSubmit = (variables, actions) => {
    return onUpdateProfile({ variables })
      .then(() => {
        dispatch(addFlash('Profile has been updated'));
        actions.setSubmitting(false);
      })
      .catch((error) => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  const _handlePasswordSubmit = (variables, actions) => {
    return onUpdatePassword({ variables })
      .then(() => {
        dispatch(addFlash('Password has been updated'));
        actions.setSubmitting(false);
        actions.resetForm();
      })
      .catch((error) => {
        const { errors, status } = serverErrors(error);
        actions.setStatus(status);
        actions.setErrors(errors);
        actions.setSubmitting(false);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-blue mb-2">{'Profile'}</h1>
      <div className="border rounded mb-4 p-4">
        <h3 className="text-blue mb-2">{'Settings'}</h3>
        <Formik
          component={ProfileForm}
          initialValues={initialValues}
          key={id || 'LOADING'}
          onSubmit={_handleProfileSubmit}
          validationSchema={profileValidationSchema}
        />
      </div>
      <div className="border rounded p-4">
        <h3 className="text-blue mb-2">{'Password'}</h3>
        <Formik
          component={PasswordForm}
          initialValues={{ password: '' }}
          key={id || 'LOADING'}
          onSubmit={_handlePasswordSubmit}
          validationSchema={passwordValidationSchema}
        />
      </div>
    </div>
  );
};

ProfilePage.propTypes = {};

export default React.memo(ProfilePage);
