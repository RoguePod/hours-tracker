import FieldError from './FieldError';
import InputBase from './InputBase';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';

const InputField = (props) => {
  const { disabled, field, form, onChange, ...rest } = props;

  const { errors, isSubmitting } = form;

  React.useEffect(() => {
    if (onChange) {
      onChange(field.value);
    }
  }, [field.value, onChange]);

  const error = _get(errors, field.name);
  const touched = _get(form.touched, field.name);
  const hasError = error && touched;

  return (
    <>
      <InputBase
        {...field}
        {...rest}
        disabled={disabled || isSubmitting}
        error={hasError}
      />
      <FieldError error={error} touched={touched} />
    </>
  );
};

InputField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.formikField.isRequired,
  form: PropTypes.formikForm.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.string
};

InputField.defaultProps = {
  disabled: false,
  onChange: null,
  type: 'text'
};

export default InputField;
