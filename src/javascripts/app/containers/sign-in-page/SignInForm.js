import { Field, Form } from 'formik';
import {
  FormError,
  InputField,
  Link,
  SubmitButton
} from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const SignInForm = ({ isSubmitting, status }) => {
  return (
    <Form noValidate>
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
      <div className="mb-4">
        <Field
          autoCapitalize="none"
          autoCorrect="off"
          component={InputField}
          label="Password"
          name="password"
          required
          type="password"
        />
      </div>
      <div className="flex flex-row justify-between">
        <SubmitButton submitting={isSubmitting} submittingText="Signing in...">
          {'Sign In'}
        </SubmitButton>
        <Link className="py-2" to="/forgot-password">
          {'Forgot Password?'}
        </Link>
      </div>
    </Form>
  );
};

SignInForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string
};

SignInForm.defaultProps = {
  status: null
};

export default SignInForm;
