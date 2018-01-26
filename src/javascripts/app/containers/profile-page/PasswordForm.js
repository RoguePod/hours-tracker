import { Field, reduxForm } from 'redux-form';
import { FormError, InputField } from 'javascripts/shared/components';

import { Form } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { isRequired } from 'javascripts/validators';

class PasswordForm extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onUpdatePassword: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  }

  static defaultProps = {
    error: null
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleSubmit(data) {
    const { onUpdatePassword } = this.props;

    return new Promise((resolve, reject) => {
      onUpdatePassword(data, resolve, reject);
    });
  }

  render() {
    const {
      error, handleSubmit, submitting
    } = this.props;

    return (
      <Form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <Field
          autoCapitalize="off"
          autoCorrect="off"
          component={InputField}
          disabled={submitting}
          label="New Password"
          name="password"
          type="password"
          validate={[isRequired]}
        />
        <Form.Button
          color="green"
          disabled={submitting}
          fluid
          loading={submitting}
          size="big"
        >
          {'Save'}
        </Form.Button>
      </Form>
    );
  }
}

export default reduxForm({
  form: 'PasswordForm'
})(PasswordForm);
