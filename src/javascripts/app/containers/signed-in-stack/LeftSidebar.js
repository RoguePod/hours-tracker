import { RecentsList, StopWatch } from "javascripts/app/containers";

import { CSSTransition } from "react-transition-group";
import { HEADER_HEIGHT } from "javascripts/globals";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _isEqual from "lodash/isEqual";
import { history } from "javascripts/app/redux/store";
import styled from "styled-components";

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

class LeftSidebar extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired,
    width: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this._handleClose = this._handleClose.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const {
      location: { hash },
      width
    } = this.props;

    return (
      !_isEqual(hash, nextProps.location.hash) || width !== nextProps.width
    );
  }

  _handleClose() {
    const { location } = this.props;

    history.push({ ...location, hash: null, replace: true });
  }

  render() {
    const { location, width } = this.props;
    const { hash } = location;

    const open = hash.match(/stopwatch/u);

    const sliderClasses =
      "fixed pin-l pin-b w-64 flex bg-blue-lightest md:shadow-md flex-col " +
      "z-10";

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
            className="fixed pin bg-smoke z-10"
            onClick={this._handleClose}
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
  }
}

export default LeftSidebar;
