import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SignInForm from './SignInForm';
import { connect } from 'react-redux';
import { signInUser } from 'javascripts/app/redux/user';

const SignInPage = ({ onSignInUser }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <SignInForm
        onSignInUser={onSignInUser}
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

export default connect(props, actions)(SignInPage);
