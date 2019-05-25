import React from 'react';
import styled from 'styled-components';

/* stylelint-disable declaration-colon-newline-after */
const Transition = styled(({ tag, children, transition, ...props }) =>
  React.createElement(tag, props, children)
)`
  transition: ${({ transition: { duration, property, timingFunction } }) =>
    `${property} ${duration}ms ${timingFunction};`};
`;
/* stylelint-enable declaration-colon-newline-after */

Transition.defaultProps = {
  transition: {
    duration: 300,
    property: 'all',
    timingFunction: 'ease'
  },
  tag: 'div'
};

export default Transition;
