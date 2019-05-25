import { RecentsList, StopWatch } from 'javascripts/app/containers';

import { CSSTransition } from 'react-transition-group';
import { HEADER_HEIGHT } from 'javascripts/globals';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { history } from 'javascripts/app/redux/store';
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

const LeftSidebar = ({ location, width }) => {
  const { hash } = location;
  const open = hash.match(/stopwatch/u);

  const handleClose = () => {
    history.push({ ...location, hash: null, replace: true });
  };

  const sliderClasses =
    'fixed left-0 bottom-0 w-64 flex bg-blue-200 shadow-md flex-col z-10';

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
        <Overlay
          className="fixed inset-0 bg-smoke z-10"
          onClick={handleClose}
        />
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
  location: PropTypes.routerLocation.isRequired,
  width: PropTypes.number.isRequired
};

const areEqual = (prevProps, nextProps) => {
  const { location, width } = prevProps;

  return location.hash === nextProps.location.hash && width === nextProps.width;
};

export default React.memo(LeftSidebar, areEqual);
