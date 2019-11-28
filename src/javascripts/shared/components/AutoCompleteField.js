import AutoCompleteBase from './AutoCompleteBase';
import FieldError from './FieldError';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';

const AutoCompleteField = (props) => {
  const { field, form } = props;

  const _handleChange = (value) => {
    form.setFieldTouched(field.name, true);
    form.setFieldValue(field.name, value);
  };

  const error = _get(form.errors, field.name);
  const touched = _get(form.touched, field.name, false);

  return (
    <>
      <AutoCompleteBase
        {...props}
        error={error}
        onChange={_handleChange}
        touched={touched}
        value={field.value}
      />

      <FieldError error={error} touched={Boolean(touched)} />
    </>
  );
};

AutoCompleteField.propTypes = {
  field: PropTypes.formikField.isRequired,
  form: PropTypes.formikForm.isRequired
};

AutoCompleteField.defaultProps = {};

export default AutoCompleteField;
