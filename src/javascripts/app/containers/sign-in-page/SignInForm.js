import {
  Button,
  FormError,
  InputField,
  Link
} from 'javascripts/shared/components';
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
        <div className="mb-4">
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
        </div>
        <div className="mb-4">
          <Field
            autoCapitalize="none"
            autoCorrect="off"
            component={InputField}
            disabled={submitting}
            label="Password"
            name="password"
            type="password"
            validate={isRequired}
          />
        </div>
        <div className="flex flex-row justify-between">
          <Button
            className="py-2"
            color="green"
            disabled={submitting}
            loading={submitting}
            type="submit"
          >
            {submitting ? 'Signing in...' : 'Submit'}
          </Button>
          <Link
            className="py-2"
            to="/sign-in/forgot-password"
          >
            {'Forgot Password?'}
          </Link>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'SignInForm'
})(SignInForm);
