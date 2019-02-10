import FieldError from './FieldError';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SelectBase from './SelectBase';

const SelectField = (props) => {
  const {
    children, disabled, field, form: { errors, isSubmitting, touched },
    ...rest
  } = props;

  const hasError = errors[field.name] && touched[field.name];

  return (
    <>
      <SelectBase
        {...field}
        {...rest}
        disabled={disabled || isSubmitting}
        error={hasError}
      >
        {children}
      </SelectBase>
      <FieldError
        error={errors[field.name]}
        touched={touched[field.name]}
      />
    </>
  );
};

SelectField.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  field: PropTypes.field.isRequired,
  form: PropTypes.form.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool
};

SelectField.defaultProps = {
  children: null,
  disabled: false,
  label: null,
  required: false
};

export default SelectField;
