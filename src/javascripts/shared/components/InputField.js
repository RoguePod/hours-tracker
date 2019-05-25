import FieldError from './FieldError';
import InputBase from './InputBase';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';

const InputField = (props) => {
  const { disabled, field, form, onChange, ...rest } = props;

  const { errors, isSubmitting } = form;

  const handleChange = (event) => {
    field.onChange(event);

    if (onChange) {
      setTimeout(() => onChange(event), 1);
    }
  };

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
        onChange={handleChange}
      />
      <FieldError error={error} touched={touched} />
    </>
  );
};

InputField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.field.isRequired,
  form: PropTypes.form.isRequired,
  onChange: PropTypes.func,
  type: PropTypes.string
};

InputField.defaultProps = {
  disabled: false,
  onChange: null,
  type: 'text'
};

export default InputField;
