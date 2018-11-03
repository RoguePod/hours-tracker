import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <div className="max-w-sm mx-auto py-4 px-2">
      <header
        className="text-blue flex flex-row items-center justify-center"
      >
        <FontAwesomeIcon
          icon="clock"
          size="3x"
        />
        <h1 className="pl-3">
          {'Hours Tracker'}
        </h1>
      </header>

      <div className="pt-6">
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
