import {
  CheckboxField, FormError, InputField, SelectField
} from 'javascripts/shared/components';
import { Field, reduxForm } from 'redux-form';

import { Form } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { isRequired } from 'javascripts/validators';
import moment from 'moment';

class ProfileForm extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onUpdateUser: PropTypes.func.isRequired,
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
    const { onUpdateUser } = this.props;

    return new Promise((resolve, reject) => {
      onUpdateUser(data, resolve, reject);
    });
  }

  render() {
    const {
      error, handleSubmit, submitting
    } = this.props;

    const recentProjectsSortOptions = [
      { text: 'Recent', value: 'startedAt' },
      { text: 'Clients', value: 'client.name' },
      { text: 'Projects', value: 'project.name' }
    ];

    const timezoneOptions = moment.tz.names().map((timezone) => {
      return {
        text: timezone,
        value: timezone
      };
    });

    const entriesTabOptions = [
      { text: 'Filter', value: '#filter' },
      { text: 'New Entry', value: '#new' }
    ];

    return (
      <Form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <Field
          autoCapitalize="sentences"
          autoCorrect="off"
          component={InputField}
          disabled={submitting}
          label="Name"
          name="name"
          type="text"
          validate={[isRequired]}
        />
        <Field
          autoCapitalize="off"
          autoCorrect="off"
          component={InputField}
          disabled={submitting}
          label="Recent Projects List Size"
          name="recentProjectsListSize"
          type="number"
          validate={[isRequired]}
        />
        <Field
          component={SelectField}
          disabled={submitting}
          label="Recent Projects Sort"
          name="recentProjectsSort"
          options={recentProjectsSortOptions}
          validate={[isRequired]}
        />
        <Field
          component={SelectField}
          disabled={submitting}
          label="Default Entries Tab"
          name="entriesTab"
          options={entriesTabOptions}
          validate={[isRequired]}
        />
        <Field
          component={SelectField}
          disabled={submitting}
          label="Timezone"
          name="timezone"
          options={timezoneOptions}
          validate={[isRequired]}
        />
        <Field
          component={CheckboxField}
          disabled={submitting}
          label="Autoload Last Description"
          name="autoloadLastDescription"
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
  form: 'ProfileForm'
})(ProfileForm);
