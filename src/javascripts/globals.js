import _isArray from 'lodash/isArray';
import _isNil from 'lodash/isNil';
import _isObject from 'lodash/isObject';
import _isString from 'lodash/isString';
import _snakeCase from 'lodash/snakeCase';
import moment from 'moment-timezone';

export const env = process.env.ENV;
export const HEADER_HEIGHT = '62px';
export const ONE_PX = '1px';
export const API_URL = process.env.API_URL;
export const COOKIE_PATHS = {
  token: 'hoursTracker.token'
};

export const isBlank = (value) => {
  return _isNil(value) || (_isString(value) && value.length === 0);
};

export const isDate = (value) => {
  return !isBlank(value) && moment(value).isValid();
};

export const toQuery = (params) => {
  const query = [];

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (!isBlank(value)) {
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });

  return query.join('&');
};

export const serverErrors = (
  error,
  defaultStatus = 'Sorry, An Error Occurred'
) => {
  let status = defaultStatus;
  const errors = {};

  error.graphQLErrors.forEach(({ field, message }) => {
    if (field === 'base') {
      status = message;
    } else {
      errors[field] = message;
    }
  });

  return { errors, status };
};

export const fromQuery = (query) => {
  const params = {};

  if (!query || query.length === 0) {
    return params;
  }

  let values = [];

  if (query.startsWith('?')) {
    values = query.substr(1).split('&');
  } else {
    values = query.split('&');
  }

  values.forEach((value) => {
    const param = value.split('=');

    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
  });

  return params;
};

export const calcHours = (startedAt, stoppedAt, timezone) => {
  if (stoppedAt) {
    return moment
      .tz(stoppedAt, timezone)
      .diff(moment.tz(startedAt, timezone), 'hours', true)
      .toFixed(1);
  }

  return moment()
    .tz(timezone)
    .diff(moment.tz(startedAt, timezone), 'hours', true)
    .toFixed(1);
};

export const snakeCaseKeys = (obj) => {
  const out = {};

  Object.keys(obj).forEach((key) => {
    let val = obj[key];

    if (_isObject(val)) {
      if (_isArray(val)) {
        val = val.map((arrayVal) => {
          return _isObject(arrayVal) ? snakeCaseKeys(arrayVal) : arrayVal;
        });
      } else {
        val = snakeCaseKeys(val);
      }
    }
    let keyOut = _snakeCase(key);
    if (key === '_destroy') {
      keyOut = '_destroy';
    }
    out[keyOut] = val;
  });

  return out;
};
