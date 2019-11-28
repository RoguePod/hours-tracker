import React from 'react';
import SelectField from './SelectField';
import moment from 'moment-timezone';

const timezoneOptions = moment.tz.names().map((timezone) => {
  return (
    <option key={timezone} value={timezone}>
      {timezone}
    </option>
  );
});

const TimezoneField = (props) => {
  return (
    <SelectField {...props}>
      <option value="">{'--Select--'}</option>
      {timezoneOptions}
    </SelectField>
  );
};

export default TimezoneField;
