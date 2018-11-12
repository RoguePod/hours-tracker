import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const AdminMenu = ({ location }) => {
  const { hash } = location;

  const baseTabClasses =
    'block rounded py-1 px-3';

  const selectedTabClasses = cx(
    baseTabClasses,
    'bg-blue text-white'
  );

  const otherTabClasses = cx(
    baseTabClasses,
    'hover:bg-blue-lighter text-blue'
  );

  const projectTabClasses =
    hash === '#projects' ? selectedTabClasses : otherTabClasses;

  return (
    <ul className="list-reset flex flex-row mb-4">
      <li
        className="mr-3"
      >
        <Link
          className={hash === '' ? selectedTabClasses : otherTabClasses}
          replace
          to={{ ...location, hash: '' }}
        >
          {'My Dashboard'}
        </Link>
      </li>
      <li
        className="mr-3"
      >
        <Link
          className={hash === '#users' ? selectedTabClasses : otherTabClasses}
          replace
          to={{ ...location, hash: '#users' }}
        >
          {'Users'}
        </Link>
      </li>
      <li
        className="mr-3"
      >
        <Link
          className={projectTabClasses}
          replace
          to={{ ...location, hash: '#projects' }}
        >
          {'Projects'}
        </Link>
      </li>
    </ul>
  );
};

AdminMenu.propTypes = {
  location: PropTypes.routerLocation.isRequired
};

export default AdminMenu;
