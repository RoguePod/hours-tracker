import FieldError from './FieldError';
import FieldHelper from './FieldHelper';
import InputBase from './InputBase';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import chrono from 'chrono-node';
import { isBlank } from 'javascripts/globals';
import moment from 'moment-timezone';

const TimeField = (props) => {
  const { disabled, field, form, onChange, timezone, ...rest } = props;

  const { errors, isSubmitting, setFieldTouched, setFieldValue } = form;

  const formatValue = (value, timezone) => {
    if (value && value > 0) {
      const date = moment.tz(value, timezone);

      if (date && date.isValid()) {
        return date.format('MM/DD/YYYY [a]t hh:mm A z');
      }
    }

    return '';
  };

  const error = _get(errors, field.name);
  const touched = _get(form.touched, field.name);
  const hasError = error && touched;
  const realTime = formatValue(field.value, timezone);

  const [value, setValue] = React.useState(formatValue(field.value));

  React.useEffect(() => {
    setValue(formatValue(field.value, timezone));
  }, []);

  React.useEffect(() => {
    if (!touched) {
      setValue(formatValue(field.value, timezone));
    }
  }, [touched, timezone, field.value]);

  const parseDate = (value, timezone) => {
    if (isBlank(value)) {
      return null;
    }

    const parsed = chrono.parseDate(value);

    if (!parsed) {
      return -1;
    }

    const values = [
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate(),
      parsed.getHours(),
      parsed.getMinutes()
    ];

    return moment
      .tz(values, timezone)
      .utc()
      .valueOf();
  };

  const handleChange = (event) => {
    const fieldValue = parseDate(event.target.value, timezone);
    setFieldTouched(field.name, true);
    setFieldValue(field.name, fieldValue);
    setValue(event.target.value);

    if (onChange) {
      setTimeout(() => onChange(event, fieldValue), 1);
    }
  };

  return (
    <>
      <InputBase
        {...rest}
        autoCapitalize="none"
        autoCorrect="off"
        disabled={disabled || isSubmitting}
        error={hasError}
        name={field.name}
        onChange={handleChange}
        type="text"
        value={value}
      />
      <FieldError error={error} touched={touched} />
      <FieldHelper
        className="text-green-500"
        message={realTime}
        open={Boolean(realTime)}
      />
    </>
  );
};

TimeField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.field.isRequired,
  form: PropTypes.form.isRequired,
  id: PropTypes.string,
  onChange: PropTypes.func,
  timezone: PropTypes.string
};

TimeField.defaultProps = {
  disabled: false,
  id: null,
  onChange: null,
  timezone: 'UTC'
};

export default TimeField;
