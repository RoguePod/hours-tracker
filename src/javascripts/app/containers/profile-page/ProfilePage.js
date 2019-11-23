import * as Yup from 'yup';

import { Formik } from 'formik';
import PasswordForm from './PasswordForm';
import ProfileForm from './ProfileForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _pick from 'lodash/pick';
import { connect } from 'react-redux';
import { updatePassword } from 'javascripts/app/redux/passwords';
import { updateUser } from 'javascripts/app/redux/user';

const ProfilePage = ({ onUpdatePassword, onUpdateUser, user }) => {
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

  const profileInitialValues = _pick(user, [
    'autoloadLastDescription',
    'name',
    'recentProjectsListSize',
    'recentProjectsSort',
    'timezone'
  ]);

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string().required('Password is Required')
  });

  const passwordInitialValues = {
    password: ''
  };

  return (
    <div className="p-4">
      <h1 className="text-blue-500 mb-2">{'Profile'}</h1>
      <div className="border rounded mb-4 p-4">
        <h3 className="text-blue-500 mb-2">{'Settings'}</h3>
        <Formik
          component={ProfileForm}
          initialValues={profileInitialValues}
          onSubmit={onUpdateUser}
          validationSchema={profileValidationSchema}
        />
      </div>
      <div className="border rounded p-4">
        <h3 className="text-blue-500 mb-2">{'Password'}</h3>
        <Formik
          component={PasswordForm}
          initialValues={passwordInitialValues}
          onSubmit={onUpdatePassword}
          validationSchema={passwordValidationSchema}
        />
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  onUpdatePassword: PropTypes.func.isRequired,
  onUpdateUser: PropTypes.func.isRequired,
  user: PropTypes.user.isRequired
};

const props = (state) => {
  return {
    user: state.app.user
  };
};

const actions = {
  onUpdatePassword: updatePassword,
  onUpdateUser: updateUser
};

export default connect(
  props,
  actions
)(ProfilePage);
