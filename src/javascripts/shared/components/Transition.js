import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styled from 'styled-components';

/* stylelint-disable declaration-colon-newline-after */
const TransitionStyled = styled.div`
  transition: ${({ transition: { duration, property, timingFunction } }) =>
    `${property} ${duration}ms ${timingFunction};`};
`;
/* stylelint-enable declaration-colon-newline-after */

const Transition = React.forwardRef(({ tag, ...props }, ref) => {
  return <TransitionStyled {...props} as={tag} ref={ref} />;
});

Transition.displayName = 'Transition';

Transition.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tag: PropTypes.any,
  transition: PropTypes.shape({
    duration: PropTypes.number,
    property: PropTypes.string,
    timingFunction: PropTypes.string
  })
};

Transition.defaultProps = {
  tag: 'div',
  transition: {
    duration: 300,
    property: 'all',
    timingFunction: 'ease'
  }
};

export default Transition;
