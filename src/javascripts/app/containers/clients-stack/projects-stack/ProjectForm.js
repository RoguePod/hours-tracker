import {
  CheckboxField, FormError, InputField
} from 'javascripts/shared/components';
import { Field, reduxForm } from 'redux-form';

import { Form } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { isRequired } from 'javascripts/validators';

class ProjectForm extends React.Component {
  static propTypes = {
    client: PropTypes.client,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  }

  static defaultProps = {
    client: null,
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
    const { client, onSaveProject } = this.props;

    return new Promise((resolve, reject) => {
      if (client) {
        onSaveProject(client, data, resolve, reject);
      } else {
        onSaveProject(data, resolve, reject);
      }
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
          autoCapitalize="sentences"
          autoCorrect="on"
          autoFocus
          component={InputField}
          disabled={submitting}
          label="Name"
          name="name"
          type="text"
          validate={[isRequired]}
        />
        <Field
          component={CheckboxField}
          label="Active?"
          name="active"
        />
        <Field
          component={CheckboxField}
          label="Billable?"
          name="billable"
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
  form: 'ProjectForm'
})(ProjectForm);
