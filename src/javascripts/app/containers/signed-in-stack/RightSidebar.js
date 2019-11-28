import { Link, useHistory, useLocation } from 'react-router-dom';

import { CSSTransition } from 'react-transition-group';
import { HEADER_HEIGHT } from 'javascripts/globals';
// import PropTypes from 'javascripts/prop-types';
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

const RightSidebar = () => {
  const location = useLocation();
  const history = useHistory();

  const _handleClose = () => {
    history.push({ ...location, hash: null, replace: true });
  };

  const _renderMenu = () => {
    // const { location: { pathname } } = this.props;
    // const isHome    = pathname === '/' || pathname.length === 0;
    // const isEntries = pathname.startsWith('/entries');
    // const isProfile = pathname.startsWith('/profile');
    // const isClients = pathname.startsWith('/clients');

    return (
      <ul className="list-reset">
        <li>
          <Link
            className="block border-b border-grey p-4 hover:bg-blue-light"
            to="/"
          >
            {'Home'}
          </Link>
        </li>
        <li>
          <Link
            className="block border-b border-grey p-4 hover:bg-blue-light"
            to="/entries"
          >
            {'Entries'}
          </Link>
        </li>
        <li>
          <Link
            className="block border-b border-grey p-4 hover:bg-blue-light"
            to="/clients"
          >
            {'Clients/Projects'}
          </Link>
        </li>
        <li>
          <Link
            className="block border-b border-grey p-4 hover:bg-blue-light"
            to="/profile"
          >
            {'Profile'}
          </Link>
        </li>
        <li>
          <Link
            className="block border-b border-grey p-4 hover:bg-blue-light"
            to="/sign-out"
          >
            {'Sign Out'}
          </Link>
        </li>
      </ul>
    );
  };

  const { pathname, hash } = location;

  const open = hash.match(/sidebar/u);

  const sliderClasses =
    'fixed pin-r pin-y w-64 flex bg-blue-lightest shadow-md flex-col ' +
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
        <Overlay className="fixed pin bg-smoke z-10" onClick={_handleClose} />
      </CSSTransition>
      <CSSTransition
        classNames="slide"
        in={Boolean(open)}
        mountOnEnter
        timeout={DURATION}
        unmountOnExit
      >
        <Slider className={sliderClasses}>{_renderMenu(pathname)}</Slider>
      </CSSTransition>
    </>
  );
};

export default React.memo(RightSidebar);
