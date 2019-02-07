import * as Yup from 'yup';

import chrono from 'chrono-node';
import moment from 'moment-timezone';

export const betweenValue = (min, max) => (value) => {
  if (value && (Number(value) < min || Number(value) > max)) {
    return `Must be between ${min} and ${max}`;
  }

  return undefined;
};

const parseTime = (value) => {
  const parsed = chrono.parseDate(value);

  if (!parsed) {
    return null;
  }

  const values = [
    parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
    parsed.getHours(), parsed.getMinutes()
  ];

  return moment(values);
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

Yup.addMethod(Yup.number, 'parsedTime', (message) => {
  return Yup.number().nullable()
    .test('parsedTime', message, (value) => {
      return value !== -1;
    });
});
