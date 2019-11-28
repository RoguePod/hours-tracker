import { CSSTransition } from 'react-transition-group';
import Collapse from './Collapse';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';

const DURATION = 300;

const FadeIn = styled.div`
  &.fade-enter {
    opacity: 0.01;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease;
  }

  &.fade-exit {
    opacity: 1;
  }

  &.fade-exit-active {
    opacity: 0.01;
    transition: opacity ${DURATION}ms ease;
  }
`;

const FieldHelper = ({ open, className, ...props }) => {
  const [slide, setSlide] = React.useState(open && !isBlank(props.message));
  const [message, setMessage] = React.useState(props.message);

  React.useEffect(() => {
    if (props.message && props.message !== message) {
      setMessage(props.message);
    }
  }, [message, props.message]);

  const isOpen = open && !isBlank(message);

  const messageClasses = cx('text-sm pt-1', className);

  return (
    <CSSTransition
      classNames="fade"
      in={isOpen}
      mountOnEnter
      onEnter={() => setSlide(true)}
      onExit={() => setSlide(false)}
      timeout={DURATION}
      unmountOnExit
    >
      <FadeIn>
        <Collapse duration={DURATION} open={slide}>
          <div className={messageClasses}>{message}</div>
        </Collapse>
      </FadeIn>
    </CSSTransition>
  );
};

FieldHelper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  open: PropTypes.bool
};

FieldHelper.defaultProps = {
  className: null,
  message: null,
  open: false
};

export default FieldHelper;
