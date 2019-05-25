import { Pill } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const AdminMenu = ({ location }) => {
  const { hash } = location;

  return (
    <ul className="flex flex-row mb-4">
      <li className="mr-3">
        <Pill replace selected={hash === ''} to={{ ...location, hash: '' }}>
          {'My Dashboard'}
        </Pill>
      </li>
      <li className="mr-3">
        <Pill
          replace
          selected={hash === '#users'}
          to={{ ...location, hash: '#users' }}
        >
          {'Users'}
        </Pill>
      </li>
      <li className="mr-3">
        <Pill
          replace
          selected={hash === '#projects'}
          to={{ ...location, hash: '#projects' }}
        >
          {'Projects'}
        </Pill>
      </li>
    </ul>
  );
};

AdminMenu.propTypes = {
  location: PropTypes.routerLocation.isRequired
};

export default AdminMenu;
