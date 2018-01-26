import { Field, reduxForm } from 'redux-form';
import { FormError, InputField } from 'javascripts/shared/components';
import { isEmail, isRequired } from 'javascripts/validators';

import { Form } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class ForgotPasswordForm extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  }

  static defaultProps = {
    error: null
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit(data) {
    const { onForgotPassword } = this.props;

    return new Promise((resolve, reject) => {
      onForgotPassword(data, resolve, reject);
    });
  }

  render() {
    const {
      handleSubmit, error, submitting
    } = this.props;

    return (
      <Form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <Field
          autoCapitalize="none"
          autoCorrect="off"
          autoFocus
          component={InputField}
          disabled={submitting}
          label="Email"
          name="email"
          type="email"
          validate={[isRequired, isEmail]}
        />
        <Form.Button
          color="green"
          disabled={submitting}
          fluid
          loading={submitting}
          size="big"
        >
          {'Send Me Password Reset Instructions'}
        </Form.Button>
      </Form>
    );
  }
}

export default reduxForm({
  form: 'ForgotPasswordForm'
})(ForgotPasswordForm);
