import { CSSTransition } from 'react-transition-group';
import { HEADER_HEIGHT } from 'javascripts/globals';
import { Link } from 'react-router-dom';
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
    transform: translateX(100%);
  }

  &.slide-enter-active {
    transform: translateX(0);
    transition: transform ${DURATION}ms ease;
  }

  &.slide-exit {
    transform: translateX(0);
  }

  &.slide-exit-active {
    transform: translateX(100%);
    transition: transform ${DURATION}ms ease;
  }
`;

const Overlay = styled(FadeIn)`
  top: ${HEADER_HEIGHT};
`;

const Slider = styled(SlideIn)`
  top: ${HEADER_HEIGHT};
`;

const RightSidebar = ({ location }) => {
  const { hash } = location;
  const open = hash.match(/sidebar/u);

  const handleClose = () => {
    history.push({ ...location, hash: null, replace: true });
  };

  const sliderClasses =
    'fixed right-0 inset-y-0 w-64 flex bg-blue-200 shadow-md flex-col ' +
    'z-10 overflow-y-auto overflow-x-hidden';

  return (
    <>
      <CSSTransition
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
        in={Boolean(open)}
        mountOnEnter
        timeout={DURATION}
        unmountOnExit
      >
        <Slider className={sliderClasses}>
          <ul>
            <li>
              <Link className="block border-b p-4 hover:bg-blue-400" to="/">
                {'Home'}
              </Link>
            </li>
            <li>
              <Link
                className="block border-b p-4 hover:bg-blue-400"
                to="/entries"
              >
                {'Entries'}
              </Link>
            </li>
            <li>
              <Link
                className="block border-b p-4 hover:bg-blue-400"
                to="/clients"
              >
                {'Clients/Projects'}
              </Link>
            </li>
            <li>
              <Link
                className="block border-b p-4 hover:bg-blue-400"
                to="/profile"
              >
                {'Profile'}
              </Link>
            </li>
            <li>
              <Link
                className="block border-b p-4 hover:bg-blue-400"
                to="/sign-out"
              >
                {'Sign Out'}
              </Link>
            </li>
          </ul>
        </Slider>
      </CSSTransition>
    </>
  );
};

RightSidebar.propTypes = {
  location: PropTypes.routerLocation.isRequired
};

const areEqual = (prevProps, nextProps) => {
  const { location } = prevProps;

  return location.hash === nextProps.location.hash;
};

export default React.memo(RightSidebar, areEqual);
