import { RecentsList, StopWatch } from 'javascripts/app/containers';
import { useHistory, useLocation } from 'react-router-dom';

import { CSSTransition } from 'react-transition-group';
import { HEADER_HEIGHT } from 'javascripts/globals';
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

const SlideIn = styled.div`
  &.slide-enter {
    transform: translateX(-100%);
  }

  &.slide-enter-active {
    transform: translateX(0);
    transition: transform ${DURATION}ms ease;
  }

  &.slide-exit {
    transform: translateX(0);
  }

  &.slide-exit-active {
    transform: translateX(-100%);
    transition: transform ${DURATION}ms ease;
  }
`;

const Overlay = styled(FadeIn)`
  top: ${HEADER_HEIGHT};
`;

const Slider = styled(SlideIn)`
  top: ${HEADER_HEIGHT};
`;

const LeftSidebar = ({ width }) => {
  const location = useLocation();
  const history = useHistory();

  const _handleClose = () => {
    history.push({ ...location, hash: null, replace: true });
  };

  const { hash } = location;

  const open = hash.match(/stopwatch/u);

  const sliderClasses =
    'fixed pin-l pin-b w-64 flex bg-blue-lightest shadow-md flex-col ' + 'z-10';

  return (
    <>
      <CSSTransition
        appear={width >= 768}
        classNames="fade"
        in={Boolean(open)}
        mountOnEnter
        timeout={DURATION}
        unmountOnExit
      >
        <Overlay className="fixed pin bg-smoke z-10" onClick={_handleClose} />
      </CSSTransition>
      <CSSTransition
        classNames="slide"
        in={Boolean(open || width >= 768)}
        mountOnEnter
        timeout={DURATION}
        unmountOnExit
      >
        <Slider className={sliderClasses}>
          <StopWatch location={location} />
          <RecentsList />
        </Slider>
      </CSSTransition>
    </>
  );
};

LeftSidebar.propTypes = {
  width: PropTypes.number.isRequired
};

export default React.memo(LeftSidebar);
