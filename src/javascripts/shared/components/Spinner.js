import { Clock, Portal } from 'javascripts/shared/components';

import { CSSTransition } from 'react-transition-group';
import { HEADER_HEIGHT } from 'javascripts/globals';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

const DURATION = 300;
const PHONE_SIZE = '768px';

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

const Page = styled(FadeIn)`
  bottom: 0;
  left: 16rem;
  right: 0;
  top: ${HEADER_HEIGHT};

  @media (max-width: ${PHONE_SIZE}) {
    left: 0;
  }
`;

const Spinner = ({ page, spinning, size, text }) => {
  const shadeClassName =
    'pin z-10 overflow-hidden bg-smoke flex items-center ' +
    'justify-center text-white flex-col';

  const children = (
    <>
      <div className="flex flex-row items-center">
        <Clock size={`${size}px`} />
      </div>
      {text && text.length > 0 && (
        <div className="pt-4 px-4 text-center">{text}</div>
      )}
    </>
  );

  if (page) {
    return (
      <Portal>
        <CSSTransition
          classNames="fade"
          in={spinning}
          mountOnEnter
          timeout={DURATION}
          unmountOnExit
        >
          <Page className={cx(shadeClassName, 'fixed')}>{children}</Page>
        </CSSTransition>
      </Portal>
    );
  }

  return (
    <CSSTransition
      classNames="fade"
      in={spinning}
      mountOnEnter
      timeout={DURATION}
      unmountOnExit
    >
      <FadeIn className={cx(shadeClassName, 'absolute')}>{children}</FadeIn>
    </CSSTransition>
  );
};

Spinner.propTypes = {
  page: PropTypes.bool,
  size: PropTypes.number,
  spinning: PropTypes.bool,
  text: PropTypes.string
};

Spinner.defaultProps = {
  page: false,
  size: 50,
  spinning: false,
  text: null
};

export default Spinner;
