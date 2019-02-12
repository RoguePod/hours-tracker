import { Field, Form } from 'formik';
import {
  FormError,
  SubmitButton,
  TextAreaField,
  TimeField,
  TimezoneField
} from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const EntryForm = ({ isSubmitting, status, values: { timezone } }) => {
  return (
    <Form
      noValidate
    >
      <FormError error={status} />
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            autoFocus
            component={TimeField}
            label="Started"
            name="startedAt"
            timezone={timezone}
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            component={TimeField}
            label="Stopped"
            name="stoppedAt"
            timezone={timezone}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            clientField="clientId"
            component={ProjectField}
            label="Project"
            name="projectId"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            component={TimezoneField}
            label="Timezone"
            name="timezone"
          />
        </div>
      </div>
      <div className="mb-4">
        <Field
          autoHeight
          component={TextAreaField}
          label="Description"
          name="description"
          rows={1}
        />
      </div>
      <SubmitButton
        submitting={isSubmitting}
      >
        {'Save'}
      </SubmitButton>
    </Form>
  );
};

EntryForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string,
  values: PropTypes.shape({
    timezone: PropTypes.string
  }).isRequired
};

EntryForm.defaultProps = {
  status: null
};

export default EntryForm;
