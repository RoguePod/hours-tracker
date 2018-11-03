import ForgotPasswordForm from './ForgotPasswordForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { forgotPassword } from 'javascripts/app/redux/passwords';

const ForgotPasswordPage = ({ onForgotPassword }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-blue pb-4">
        {'Forgot Password?'}
      </h2>
      <ForgotPasswordForm
        onForgotPassword={onForgotPassword}
      />
    </div>
  );
};

ForgotPasswordPage.propTypes = {
  onForgotPassword: PropTypes.func.isRequired
};

const props = () => {
  return {};
};

const actions = {
  onForgotPassword: forgotPassword
};

export default connect(props, actions)(ForgotPasswordPage);
