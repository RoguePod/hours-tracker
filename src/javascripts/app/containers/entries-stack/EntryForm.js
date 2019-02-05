import {
  Button,
  FormError,
  TextAreaField,
  TimeField,
  TimezoneField
} from 'javascripts/shared/components';
import { Field, Form } from 'formik';

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
            autoCapitalize="none"
            autoCorrect="off"
            autoFocus
            component={TimeField}
            label="Started"
            name="startedAt"
            timezone={timezone}
            type="text"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            autoCapitalize="none"
            autoCorrect="off"
            component={TimeField}
            label="Stopped"
            name="stoppedAt"
            timezone={timezone}
            type="text"
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            clientField="clientRef"
            component={ProjectField}
            label="Project"
            name="projectRef"
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
          autoCapitalize="sentences"
          autoCorrect="on"
          autoHeight
          component={TextAreaField}
          label="Description"
          name="description"
          rows={1}
        />
      </div>
      <Button
        className="py-2"
        color="green"
        disabled={isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </Form>
  );
};

EntryForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string,
  values: PropTypes.shape({
    timezone: PropTypes.string.isRequired
  }).isRequired
};

EntryForm.defaultProps = {
  status: null
};

export default EntryForm;
