import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Portal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
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

const Loader = ({ loading }) => {
  const shadeClassName =
    'fixed pin z-10 overflow-auto bg-white flex items-center justify-center ' +
    'text-blue flex-col';

  return (
    <Portal>
      <CSSTransition
        classNames="fade"
        in={loading}
        mountOnEnter
        timeout={DURATION}
        unmountOnExit
      >
        <FadeIn
          className={shadeClassName}
        >
          <div className="flex flex-row items-center">
            <FontAwesomeIcon
              icon="clock"
              pulse
              size="3x"
            />
            <div className="pl-2 text-4xl">
              {'Hours Tracker'}
            </div>
          </div>
        </FadeIn>
      </CSSTransition>
    </Portal>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool
};

Loader.defaultProps = {
  loading: false
};

export default Loader;
