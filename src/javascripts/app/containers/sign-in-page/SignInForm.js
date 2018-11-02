import { Button, FormError, InputField } from 'javascripts/shared/components';
import { Field, reduxForm } from 'redux-form';
import { isEmail, isRequired } from 'javascripts/validators';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

class SignInForm extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSignInUser: PropTypes.func.isRequired,
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
    const { onSignInUser } = this.props;

    return new Promise((resolve, reject) => {
      onSignInUser(data, reject);
    });
  }

  render() {
    const {
      handleSubmit, error, submitting
    } = this.props;

    return (
      <form
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
          id="email"
          label="Email"
          name="email"
          type="email"
          validate={[isRequired, isEmail]}
        />
        <Field
          autoCapitalize="none"
          autoCorrect="off"
          component={InputField}
          disabled={submitting}
          id="password"
          label="Password"
          name="password"
          type="password"
          validate={isRequired}
        />
        <Button
          className="w-full py-4"
          color="green"
          disabled={submitting}
          loading={submitting}
          type="submit"
        >
          {'Sign In'}
        </Button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'SignInForm'
})(SignInForm);
