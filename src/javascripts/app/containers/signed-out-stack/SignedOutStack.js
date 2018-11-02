import Header from './Header';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Routes from './Routes';
import { connect } from 'react-redux';

const SignedOutStack = (props) => {
  const { auth } = props;

  if (auth) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className="max-w-md mx-auto py-4 px-2">
      <Header {...props} />

      <div className="pt-4">
        <Routes {...props} />
      </div>
    </div>
  );
};

SignedOutStack.propTypes = {
  auth: PropTypes.auth
};

SignedOutStack.defaultProps = {
  auth: null
};

const props = (state) => {
  return {
    auth: state.app.auth
  };
};

const actions = {};

export default connect(props, actions)(SignedOutStack);
