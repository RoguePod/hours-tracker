/* global document */

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _padStart from 'lodash/padStart';
import cx from 'classnames';
import moment from 'moment-timezone';

const Timer = ({ disabled, entry }) => {
  const [duration, setDuration] = React.useState(null);

  const handleTick = () => {
    if (disabled) {
      if (duration) {
        setDuration(null);
        document.title = 'Hours Tracker';
      }

      return;
    }

    const now = moment().tz(entry.timezone);
    const startedAt = moment.tz(entry.startedAt, entry.timezone);
    const newDuration = moment.duration(now.diff(startedAt));

    const hours = _padStart(newDuration.get('hours'), 2, '0');
    const minutes = _padStart(newDuration.get('minutes'), 2, '0');
    const seconds = _padStart(newDuration.get('seconds'), 2, '0');

    document.title = `${hours}:${minutes}:${seconds} - Hours Tracker`;

    setDuration(newDuration);
  };

  React.useEffect(() => {
    if (disabled || !entry.startedAt) {
      return;
    }

    handleTick();
    const timer = setInterval(() => handleTick(), 1000);

    return () => {
      clearInterval(timer);

      document.title = 'Hours Tracker';
    };
  }, [disabled, entry?.startedAt, entry?.timezone]);

  let hours = '00';
  let minutes = '00';
  let seconds = '00';

  if (duration) {
    hours = _padStart(duration.get('hours'), 2, '0');
    minutes = _padStart(duration.get('minutes'), 2, '0');
    seconds = _padStart(duration.get('seconds'), 2, '0');
  }

  const numberClasses = cx('rounded text-center px-2 text-3xl flex-1', {
    'bg-blue-500': !disabled,
    'bg-gray-600': disabled
  });

  const separatorClasses = cx('text-center text-3xl px-2', {
    'text-blue-500': !disabled,
    'text-gray-600': disabled
  });

  const containerClasses =
    'flex flex-row flex-no-wrap items-center justify-center text-white ' +
    'font-mono';

  return (
    <div className={containerClasses}>
      <div className={numberClasses}>{hours}</div>
      <div className={separatorClasses}>{':'}</div>
      <div className={numberClasses}>{minutes}</div>
      <div className={separatorClasses}>{':'}</div>
      <div className={numberClasses}>{seconds}</div>
    </div>
  );
};

Timer.propTypes = {
  disabled: PropTypes.bool,
  entry: PropTypes.entry.isRequired
};

Timer.defaultProps = {
  disabled: false
};

const areEqual = (prevProps, nextProps) => {
  const { disabled, entry } = prevProps;

  return (
    disabled === nextProps.disabled &&
    entry?.startedAt === nextProps.entry?.startedAt &&
    entry?.timezone === nextProps.entry?.timezone
  );
};

export default React.memo(Timer, areEqual);
