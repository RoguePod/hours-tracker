import FieldError from './FieldError';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import cx from 'classnames';

const CheckboxField = (props) => {
  const { disabled, field, form, label, onChange } = props;

  const error = _get(form.errors, field.name);
  const touched = _get(form.touched, field.name);
  const hasError = error && touched;
  const isDisabled = disabled || form.isSubmitting;
  // const icon = value ? ['far', 'check-square'] : ['far', 'square'];

  const labelClassName = cx('block flex flex-row items-center cursor-pointer', {
    'text-gray-800': !hasError && !isDisabled,
    'text-gray-300': !hasError && isDisabled,
    'text-red-500': hasError
  });

  React.useEffect(() => {
    if (onChange) {
      onChange(field.value);
    }
  }, [field.value, onChange]);

  const _handleChange = () => {
    if (disabled || form.isSubmitting) {
      return;
    }

    form.setFieldValue(field.name, !field.value);
  };

  return (
    <>
      <label className={labelClassName}>
        <input
          {...props.field}
          checked={field.value}
          disabled={isDisabled}
          onChange={_handleChange}
          type="checkbox"
        />
        {/* <div className="focus:text-teal-500">
          <FontAwesomeIcon icon={icon} size={size} />
        </div> */}
        <div className="ml-2">{label}</div>
      </label>
      <FieldError error={error} touched={touched} />
    </>
  );
};

CheckboxField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.formikField.isRequired,
  form: PropTypes.formikForm.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  size: PropTypes.string
};

CheckboxField.defaultProps = {
  disabled: false,
  label: null,
  onChange: null,
  size: '1x'
};

export default CheckboxField;
