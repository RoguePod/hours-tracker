import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOutUser } from 'javascripts/app/redux/user';

const SignOutPage = ({ onSignOutUser }) => {
  React.useEffect(() => {
    onSignOutUser();
  }, []);

  return <Redirect to="/sign-in" />;
};

SignOutPage.propTypes = {
  onSignOutUser: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onSignOutUser: signOutUser
};

export default connect(
  props,
  actions
)(SignOutPage);
