import {
  Button,
  CheckboxField,
  FormError,
  InputField,
  SelectField
} from 'javascripts/shared/components';
import { Field, reduxForm } from 'redux-form';

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

  _convertToOptions(values) {
    return values.map((value) => {
      return (
        <option
          key={value.value}
          value={value.value}
        >
          {value.text}
        </option>
      );
    });
  }

  _getRecentProjectsSortOptions() {
    return this._convertToOptions([
      { text: 'Recent', value: 'startedAt' },
      { text: 'Clients', value: 'client.name' },
      { text: 'Projects', value: 'project.name' }
    ]);
  }

  _getTimezoneOptions() {
    return this._convertToOptions(moment.tz.names().map((timezone) => {
      return {
        text: timezone,
        value: timezone
      };
    }));
  }

  _getEntriesTabOptions() {
    return this._convertToOptions([
      { text: 'Filter', value: '#filter' },
      { text: 'New Entry', value: '#new' }
    ]);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const { error, handleSubmit, submitting } = this.props;

    return (
      <form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <Field
          autoCapitalize="sentences"
          autoCorrect="off"
          component={InputField}
          disabled={submitting}
          id="name"
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
          id="recentProjectsListSize"
          label="Recent Projects List Size"
          name="recentProjectsListSize"
          type="number"
          validate={[isRequired]}
        />
        <Field
          component={SelectField}
          disabled={submitting}
          id="recentProjectsSort"
          label="Recent Projects Sort"
          name="recentProjectsSort"
          validate={[isRequired]}
        >
          <option value="">
            {'--Select--'}
          </option>
          {this._getRecentProjectsSortOptions()}
        </Field>
        <Field
          component={SelectField}
          disabled={submitting}
          id="entriesTab"
          label="Default Entries Tab"
          name="entriesTab"
          validate={[isRequired]}
        >
          <option value="">
            {'--Select--'}
          </option>
          {this._getEntriesTabOptions()}
        </Field>
        <Field
          component={SelectField}
          disabled={submitting}
          id="timezone"
          label="Timezone"
          name="timezone"
          validate={[isRequired]}
        >
          <option value="">
            {'--Select--'}
          </option>
          {this._getTimezoneOptions()}
        </Field>
        <Field
          component={CheckboxField}
          disabled={submitting}
          label="Autoload Last Description"
          name="autoloadLastDescription"
        />
        <Button
          className="py-2"
          color="green"
          disabled={submitting}
          loading={submitting}
          type="submit"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default reduxForm({
  form: 'ProfileForm'
})(ProfileForm);
