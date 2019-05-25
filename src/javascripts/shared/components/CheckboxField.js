import FieldError from './FieldError';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import cx from 'classnames';

const CheckboxField = (props) => {
  const {
    disabled,
    field: { name, value },
    form,
    label
  } = props;

  const { errors, isSubmitting, setFieldValue } = form;

  const error = _get(errors, name);
  const touched = _get(form.touched, name);
  const hasError = error && touched;
  const isDisabled = disabled || isSubmitting;
  const icon = value ? ['far', 'check-square'] : ['far', 'square'];

  const labelClassName = cx('block flex flex-row items-center cursor-pointer', {
    'text-gray-700': !hasError && !isDisabled,
    'text-gray-400': !hasError && isDisabled,
    'text-red-500': hasError
  });

  const handleChange = () => {
    if (disabled || isSubmitting) {
      return;
    }

    setFieldValue(name, !value);
  };

  return (
    <>
      <label className={labelClassName} onClick={handleChange}>
        <FontAwesomeIcon icon={icon} />
        <div className="ml-2">{label}</div>
      </label>
      <FieldError error={error} touched={touched} />
    </>
  );
};

CheckboxField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.field.isRequired,
  form: PropTypes.form.isRequired,
  label: PropTypes.string
};

CheckboxField.defaultProps = {
  disabled: false,
  label: null
};

export default CheckboxField;
