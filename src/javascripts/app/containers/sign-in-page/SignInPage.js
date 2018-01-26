import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Segment } from 'semantic-ui-react';
import SignInForm from './SignInForm';
import { connect } from 'react-redux';
import { signInUser } from 'javascripts/app/redux/user';

const SignInPage = ({ onSignInUser }) => {
  return (
    <Segment>
      <SignInForm
        onSignInUser={onSignInUser}
      />
    </Segment>
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
