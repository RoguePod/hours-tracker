import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _times from 'lodash/times';
import styled from 'styled-components';

const Circle = styled.circle`
  fill: white;
  stroke: #4e8eb2;
  stroke-width: 12px;
`;

const Center = styled.circle`
  fill: #4e8eb2;
`;

const HourHand = styled.line`
  stroke-width: 8px;
  stroke: #4e8eb2;
`;

const MinuteHand = styled.line`
  stroke-width: 12px;
  stroke: #4e8eb2;
`;

const Tick = styled.line`
  stroke-width: 10px;
  stroke: #4e8eb2;
`;

const Clock = ({ animate, size }) => {
  const ticks = _times(12, (index) => {
    return (
      <Tick
        key={index}
        transform={`rotate(${(index * 360) / 12} 100 100)`}
        x1="100"
        x2="100"
        y1="30"
        y2="40"
      />
    );
  });

  let minuteFrom = null;
  let minuteTo   = null;
  let hourFrom   = null;
  let hourTo     = null;

  if (animate) {
    const date        = new Date();
    const hoursAngle  = ((360 * date.getHours()) / 12) +
      (date.getMinutes() / 2);
    const minuteAngle = (360 * date.getMinutes()) / 60;

    const shifter = (val) => {
      return [val, 100, 100].join(' ');
    };

    minuteFrom = shifter(minuteAngle);
    minuteTo = shifter(minuteAngle + 360);
    hourFrom = shifter(hoursAngle);
    hourTo = shifter(hoursAngle + 360);
  }

  return (
    <svg
      height={size}
      viewBox="0 0 200 200"
      width={size}
    >
      <Circle
        cx="100"
        cy="100"
        id="circle"
        r="80"
      />
      <g>
        <HourHand
          from={hourFrom}
          id="hourhand"
          to={hourTo}
          transform="rotate(90 100 100)"
          x1="100"
          x2="100"
          y1="100"
          y2="58"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            dur="6s"
            from={hourFrom}
            repeatCount="indefinite"
            to={hourTo}
            type="rotate"
          />
        </HourHand>
        <MinuteHand
          from={minuteFrom}
          id="minutehand"
          to={minuteTo}
          x1="100"
          x2="100"
          y1="100"
          y2="48"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            dur="1s"
            from={minuteFrom}
            repeatCount="indefinite"
            to={minuteTo}
            type="rotate"
          />
        </MinuteHand>
      </g>
      <Center
        cx="100"
        cy="100"
        r="10"
      />
      {ticks}
    </svg>
  );
};

Clock.propTypes = {
  animate: PropTypes.bool,
  size: PropTypes.string
};

Clock.defaultProps = {
  animate: true,
  size: '100%'
};

export default Clock;
