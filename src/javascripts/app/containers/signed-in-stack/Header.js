import { Clock } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HEADER_HEIGHT } from 'javascripts/globals';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Tab from './Tab';
import styled from 'styled-components';

const Header = styled.header`
  height: ${HEADER_HEIGHT};
`;

const SignedInHeader = ({ location, running, user }) => {
  const { hash, pathname } = location;

  const headerClasses =
    'fixed top-0 inset-x-0 px-4 bg-blue-500 text-white overflow-hidden z-10';

  const menuHash = hash.match(/sidebar/u) ? '' : 'sidebar';
  const logoHash = hash.match(/stopwatch/u) ? '' : 'stopwatch';

  const barClasses = 'flex justify-center rounded py-1 px-2 hover:bg-blue-400';

  return (
    <Header className={headerClasses}>
      <div className="flex items-center h-full">
        <div className="flex-1 flex items-center">
          <div className="pr-2 hidden lg:flex">
            <Clock animate={false} size="40px" />
          </div>
          <Link
            className="mr-2 md:hidden flex hover:bg-blue-400 rounded"
            to={{ ...location, hash: logoHash, replace: true }}
          >
            <Clock animate={running} size="40px" />
          </Link>
          <Link className="text-xl" to="/">
            {'Hours Tracker'}
          </Link>
        </div>
        <ul className="items-center hidden md:flex">
          <li className="mr-3 lg:mr-6 uppercase text-sm">{user.name}</li>

          <li className="mr-2 lg:mr-4">
            <Tab selected={pathname === '/' || pathname.length === 0} to="/">
              {'Home'}
            </Tab>
          </li>
          <li className="mr-2 lg:mr-4">
            <Tab selected={pathname.startsWith('/entries')} to="/entries">
              {'Entries'}
            </Tab>
          </li>
          <li className="mr-2 lg:mr-4">
            <Tab selected={pathname.startsWith('/clients')} to="/clients">
              {'Clients/Projects'}
            </Tab>
          </li>
          <li className="mr-2 lg:mr-4">
            <Tab selected={pathname.startsWith('/profile')} to="/profile">
              {'Profile'}
            </Tab>
          </li>
          <li>
            <Tab to="/sign-out">{'Sign Out'}</Tab>
          </li>
        </ul>
        <ul className="flex items-center md:hidden">
          <li>
            <Link
              className={barClasses}
              to={{ ...location, hash: menuHash, replace: true }}
            >
              <FontAwesomeIcon icon="bars" size="2x" />
            </Link>
          </li>
        </ul>
      </div>
    </Header>
  );
};

SignedInHeader.propTypes = {
  location: PropTypes.routerLocation.isRequired,
  running: PropTypes.bool.isRequired,
  user: PropTypes.user.isRequired
};

const areEqual = (prevProps, nextProps) => {
  const { location, running, user } = prevProps;

  return (
    location.pathname === nextProps.location.pathname &&
    location.hash === nextProps.location.hash &&
    running === nextProps.running &&
    user.name === nextProps.user.name
  );
};

export default React.memo(SignedInHeader, areEqual);
