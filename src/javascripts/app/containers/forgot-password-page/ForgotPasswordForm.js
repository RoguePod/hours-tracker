import { Field, Form } from 'formik';
import {
  FormError,
  InputField,
  Link,
  SubmitButton
} from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const ForgotPasswordForm = ({ isSubmitting, status }) => {
  return (
    <Form
      noValidate
    >
      <FormError error={status} />
      <div className="mb-4">
        <Field
          autoCapitalize="none"
          autoCorrect="off"
          autoFocus
          component={InputField}
          label="Email"
          name="email"
          required
          type="email"
        />
      </div>
      <div className="flex flex-row justify-between">
        <SubmitButton
          submitting={isSubmitting}
          submittingText="Submitting..."
        >
          {'Submit'}
        </SubmitButton>
        <Link
          className="py-2"
          to="/sign-in"
        >
          {'Sign In'}
        </Link>
      </div>
    </Form>
  );
};

ForgotPasswordForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string
};

ForgotPasswordForm.defaultProps = {
  status: null
};

export default ForgotPasswordForm;
