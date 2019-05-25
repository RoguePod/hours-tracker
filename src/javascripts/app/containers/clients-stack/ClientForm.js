import {
  CheckboxField,
  FormError,
  InputField,
  SubmitButton
} from 'javascripts/shared/components';
import { Field, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const ClientForm = ({ isSubmitting, status }) => {
  return (
    <Form noValidate>
      <FormError error={status} />
      <div className="mb-4">
        <Field
          autoCapitalize="sentences"
          autoCorrect="on"
          autoFocus
          component={InputField}
          label="Name"
          name="name"
          type="text"
        />
      </div>
      <div className="mb-4">
        <Field component={CheckboxField} label="Active?" name="active" />
      </div>
      <SubmitButton submitting={isSubmitting}>{'Save'}</SubmitButton>
    </Form>
  );
};

ClientForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string
};

ClientForm.defaultProps = {
  status: null
};

export default ClientForm;
