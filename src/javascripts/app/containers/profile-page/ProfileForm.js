import {
  CheckboxField,
  FormError,
  InputField,
  SelectField,
  SubmitButton,
  TimezoneField
} from 'javascripts/shared/components';
import { Field, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const ProfileForm = ({ isSubmitting, status }) => {
  const convertToOptions = (values) => {
    return values.map((value) => {
      return (
        <option key={value.value} value={value.value}>
          {value.text}
        </option>
      );
    });
  };

  const getRecentProjectsSortOptions = () => {
    return convertToOptions([
      { text: 'Recent', value: 'startedAt' },
      { text: 'Clients', value: 'client.name' },
      { text: 'Projects', value: 'project.name' }
    ]);
  };

  return (
    <Form noValidate>
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
          <option value="">{'--Select--'}</option>
          {getRecentProjectsSortOptions()}
        </Field>
      </div>
      <div className="mb-4">
        <Field
          component={TimezoneField}
          label="Timezone"
          name="timezone"
          required
        />
      </div>
      <div className="mb-4">
        <Field
          component={CheckboxField}
          label="Autoload Last Description"
          name="autoloadLastDescription"
        />
      </div>
      <SubmitButton submitting={isSubmitting}>{'Save'}</SubmitButton>
    </Form>
  );
};

ProfileForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string
};

ProfileForm.defaultProps = {
  status: null
};

export default ProfileForm;
