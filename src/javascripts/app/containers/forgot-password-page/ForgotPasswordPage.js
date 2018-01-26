import ForgotPasswordForm from './ForgotPasswordForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { forgotPassword } from 'javascripts/app/redux/passwords';

const ForgotPasswordPage = ({ onForgotPassword }) => {
  return (
    <Segment>
      <ForgotPasswordForm
        onForgotPassword={onForgotPassword}
      />
    </Segment>
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
