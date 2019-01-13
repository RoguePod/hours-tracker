import {
  Button,
  FormError,
  InputField,
  Link
} from 'javascripts/shared/components';
import { Field, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const SignInForm = (props) => {
  const { isSubmitting, status } = props;

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
        <Button
          className="py-2"
          color="green"
          disabled={isSubmitting}
          loading={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Signing in...' : 'Submit'}
        </Button>
        <Link
          className="py-2"
          to="/sign-in/forgot-password"
        >
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
