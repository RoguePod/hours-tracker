import { Field, Form } from "formik";
import {
  FormError,
  InputField,
  SubmitButton
} from "javascripts/shared/components";

import PropTypes from "javascripts/prop-types";
import React from "react";

const PasswordForm = props => {
  const { isSubmitting, status } = props;

  return (
    <Form noValidate>
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
      <SubmitButton submitting={isSubmitting}>{"Save"}</SubmitButton>
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
