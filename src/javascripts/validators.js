import chrono from 'chrono-node';
import { isBlank } from 'javascripts/globals';
import moment from 'moment';

export const isRequired = (value) => {
  return isBlank(value) ? 'Required' : undefined;
};

export const isEmail = (value) => {
  if (value && !(/.+@.+/).test(String(value))) {
    return 'Invalid Email Address';
  }

  return undefined;
};

export const isConfirmed = (value) => {
  if (Number(value) === 1) {
    return undefined;
  }

  return 'Must be checked';
};

const minLength = (min) => (value) => {
  if (value && value.length < min) {
    return `Must be at least ${min} characters`;
  }

  return undefined;
};

export const minLength6 = minLength(6);

export const maxValue = (max) => (value) => {
  if (value && Number(value) > max) {
    return `Must be less than ${max}`;
  }

  return undefined;
};

export const minValue = (min) => (value) => {
  if (value && Number(value) < min) {
    return `Must be more than ${min}`;
  }

  return undefined;
};

export const betweenValue = (min, max) => (value) => {
  if (value && (Number(value) < min || Number(value) > max)) {
    return `Must be between ${min} and ${max}`;
  }

  return undefined;
};

export const isZip = (value) => {
  /* eslint-disable max-len */
  if (value &&
      !value.match(/(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/)) {
    return 'Must be in the format US (12345 or 12345-1234) or ' +
      'Canada (A0A 0A0 or A0A0A0)';
  }
  /* eslint-enable max-len */

  return undefined;
};

export const isUSZip = (value) => {
  /* eslint-disable max-len */
  if (value &&
      !value.match(/(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/)) {
    return 'Invalid Zip format (12345 or 12345-1234)';
  }
  /* eslint-enable max-len */

  return undefined;
};

const parseTime = (value, timezone) => {
  const parsed = chrono.parseDate(value);

  if (!parsed) {
    return null;
  }

  const values = [
    parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
    parsed.getHours(), parsed.getMinutes()
  ];

  return moment.tz(values, timezone);
};

export const isParsedTime = (value, { timezone }) => {
  if (value) {
    const time = parseTime(value, timezone);

    if (!time || !time.isValid()) {
      return 'Invalid Time';
    }
  }

  return undefined;
};

export const isStoppedAt = (value, { startedAt, timezone }) => {
  if (value) {
    const stoppedAt = parseTime(value, timezone);

    if (stoppedAt && stoppedAt.isValid()) {
      const parsedStartedAt = parseTime(startedAt, timezone);

      if (parsedStartedAt && parsedStartedAt.isAfter(stoppedAt)) {
        return 'Stopped must be after Started';
      }
    }
  }

  return undefined;
};
