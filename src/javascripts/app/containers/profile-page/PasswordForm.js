import { Button, FormError, InputField } from 'javascripts/shared/components';
import { Field, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const PasswordForm = (props) => {
  const { isSubmitting, status } = props;

  return (
    <Form
      noValidate
    >
      <FormError error={status} />
      <div className="mb-4">
        <Field
          autoCapitalize="off"
          autoCorrect="off"
          component={InputField}
          label="New Password"
          name="password"
          required
          type="password"
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
};

PasswordForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string
};

PasswordForm.defaultProps = {
  status: null
};

export default PasswordForm;
