import posed, { PoseGroup } from 'react-pose';

import { Link } from 'react-router-dom';
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
  exit: { x: '100%' }
});
/* eslint-disable id-length */

const Overlay = styled(FadeIn)`
  top: 62px;
`;

const Slider = styled(SlideIn)`
  top: 62px;
`;

class RightSidebar extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired
  }

  constructor(props) {
    super(props);

    this._handleClose = this._handleClose.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { location } = this.props;

    return (
      !_isEqual(location, nextProps.location)
    );
  }

  _handleClose() {
    const { location } = this.props;

    history.push({ ...location, hash: null });
  }

  _renderMenu() {
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
  }

  render() {
    const { location } = this.props;

    const { pathname, hash } = location;

    const open = hash.match(/sidebar/u);

    const sliderClasses =
      'fixed pin-r pin-y w-64 flex bg-blue-lightest shadow-md flex-col ' +
      'transition z-10 overflow-y-auto overflow-x-hidden';

    return (
      <PoseGroup>
        {open &&
          <Overlay
            className="fixed pin bg-smoke z-10"
            key="overlay"
            onClick={this._handleClose}
          />}
        {open &&
          <Slider
            className={sliderClasses}
            key="menu"
          >
            {this._renderMenu(pathname)}
          </Slider>}
      </PoseGroup>
    );
  }
}

export default RightSidebar;
