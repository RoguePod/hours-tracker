import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SignInForm from './SignInForm';
import { addFlash } from 'javascripts/shared/redux/flashes';
import { connect } from 'react-redux';
import { signInUser } from 'javascripts/app/redux/user';

const SignInPage = (props) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue pb-4">
        {'Sign In'}
      </h2>
      <SignInForm {...props} />
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
  onAddFlash: addFlash,
  onSignInUser: signInUser
};

export default connect(props, actions)(SignInPage);
