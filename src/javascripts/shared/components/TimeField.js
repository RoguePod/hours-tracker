import FieldHelper from './FieldHelper';
import InputField from './InputField';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import moment from 'moment';

const TimeField = (props) => {
  const { field: { value }, timezone } = props;

  let realTime = null;
  if (value && value.length > 0) {
    const parsed = chrono.parseDate(value);

    if (parsed) {
      const values = [
        parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
        parsed.getHours(), parsed.getMinutes()
      ];

      realTime = moment.tz(values, timezone)
        .format('MM/DD/YYYY [a]t hh:mm A z');
    }
  }

  return (
    <>
      <InputField
        {...props}
        type="text"
      />
      <FieldHelper
        className="text-green"
        color="green"
        message={realTime}
        open={Boolean(realTime)}
      />
    </>
  );
};

TimeField.propTypes = {
  field: PropTypes.field.isRequired,
  form: PropTypes.form.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  timezone: PropTypes.string.isRequired
};

TimeField.defaultProps = {
  id: null,
  label: null
};

export default TimeField;
