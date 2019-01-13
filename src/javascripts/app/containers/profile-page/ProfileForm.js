import {
  Button,
  CheckboxField,
  FormError,
  InputField,
  SelectField
} from 'javascripts/shared/components';
import { Field, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import moment from 'moment';

class ProfileForm extends React.Component {
  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    status: PropTypes.string
  }

  static defaultProps = {
    status: null
  }

  shouldComponentUpdate() {
    return true;
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
    const { isSubmitting, status } = this.props;

    return (
      <Form
        noValidate
      >
        <FormError error={status} />
        <div className="mb-4">
          <Field
            autoCapitalize="sentences"
            autoCorrect="off"
            component={InputField}
            label="Name"
            name="name"
            required
            type="text"
          />
        </div>
        <div className="mb-4">
          <Field
            autoCapitalize="off"
            autoCorrect="off"
            component={InputField}
            label="Recent Projects List Size"
            name="recentProjectsListSize"
            required
            type="number"
          />
        </div>
        <div className="mb-4">
          <Field
            component={SelectField}
            label="Recent Projects Sort"
            name="recentProjectsSort"
            required
          >
            <option value="">
              {'--Select--'}
            </option>
            {this._getRecentProjectsSortOptions()}
          </Field>
        </div>
        {/* <div className="mb-4">
          <Field
            component={SelectField}
            disabled={submitting}
            label="Default Entries Tab"
            name="entriesTab"
            validate={[isRequired]}
          >
            <option value="">
              {'--Select--'}
            </option>
            {this._getEntriesTabOptions()}
          </Field>
        </div> */}
        <div className="mb-4">
          <Field
            component={SelectField}
            label="Timezone"
            name="timezone"
            required
          >
            <option value="">
              {'--Select--'}
            </option>
            {this._getTimezoneOptions()}
          </Field>
        </div>
        <div className="mb-4">
          <Field
            component={CheckboxField}
            label="Autoload Last Description"
            name="autoloadLastDescription"
          />
        </div>
        <Button
          className="py-2"
          color="green"
          disabled={isSubmitting}
          loading={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default ProfileForm;
