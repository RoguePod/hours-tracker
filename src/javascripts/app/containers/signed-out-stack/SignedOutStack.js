import { Clock } from "javascripts/shared/components";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import Routes from "./Routes";
import { connect } from "react-redux";

const SignedOutStack = props => {
  const { token } = props;

  if (token) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <div className="max-w-sm mx-auto py-4 px-2">
        <header className="text-blue flex flex-row items-center justify-center">
          <Clock animate={false} size="50px" />
          <h1 className="pl-3">{"Hours Tracker"}</h1>
        </header>

        <div className="pt-6">
          <Routes {...props} />
        </div>
      </div>
    </div>
  );
};

SignedOutStack.propTypes = {
  token: PropTypes.string
};

SignedOutStack.defaultProps = {
  token: null
};

const props = state => {
  return {
    token: state.app.token
  };
};

const actions = {};

export default connect(
  props,
  actions
)(SignedOutStack);
