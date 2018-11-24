import { RecentsList, StopWatch } from 'javascripts/app/containers';
import posed, { PoseGroup } from 'react-pose';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { history } from 'javascripts/app/redux/store';
import styled from 'styled-components';

const FadeIn = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

/* eslint-disable id-length */
const SlideIn = posed.div({
  enter: { x: 0 },
  exit: { x: '-100%' }
});
/* eslint-disable id-length */

const Overlay = styled(FadeIn)`
  top: 62px;
`;

const Slider = styled(SlideIn)`
  top: 62px;
`;

class LeftSidebar extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired,
    width: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this._handleClose = this._handleClose.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { location: { hash }, width } = this.props;

    return (
      !_isEqual(hash, nextProps.location.hash) ||
      width !== nextProps.width
    );
  }

  _handleClose() {
    const { location } = this.props;

    history.push({ ...location, hash: null, replace: true });
  }

  render() {
    const { location: { hash }, width } = this.props;

    const open = hash.match(/stopwatch/u);

    const sliderClasses =
      'fixed pin-l pin-b w-64 flex bg-blue-lightest md:shadow-md flex-col ' +
      'transition z-10';

    return (
      <React.Fragment>
        <PoseGroup>
          {open &&
            <Overlay
              className="fixed pin bg-smoke z-10"
              key="overlay"
              onClick={this._handleClose}
            />}
        </PoseGroup>
        <Slider
          className={sliderClasses}
          key="sidebar"
          pose={(open || width >= 768) ? 'enter' : 'exit'}
        >
          <StopWatch />
          <RecentsList />
        </Slider>
      </React.Fragment>
    );
  }
}

export default LeftSidebar;
