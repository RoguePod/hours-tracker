import { InputField } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import moment from 'moment';
import posed from 'react-pose';

const FadeIn = posed.div({
  hide: { height: 0, opacity: 0 },
  show: { height: 'auto', opacity: 1 }
});

const TimeField = (props) => {
  const { input, timezone } = props;

  let realTime = null;
  if (input.value && input.value.length > 0) {
    const parsed = chrono.parseDate(input.value);

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
      <InputField {...props} />
      <FadeIn
        className="text-green text-sm"
        pose={realTime ? 'show' : 'hide'}
      >
        {realTime &&
          <div className="pt-1">
            {realTime}
          </div>}
      </FadeIn>
    </>
  );
};

TimeField.propTypes = {
  id: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool
  }).isRequired,
  timezone: PropTypes.string.isRequired
};

TimeField.defaultProps = {
  id: null,
  label: null
};

export default TimeField;
