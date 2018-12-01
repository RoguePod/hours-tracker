import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const EntriesIndexMenu = ({ location }) => {
  const { pathname } = location;

  const isRoot    = pathname === '/entries';
  const isSummary = pathname === '/entries/summary';

  const basePillClasses       = 'block py-2 px-4 text-center';
  const selectedPillClasses   = 'bg-blue text-white border-blue';
  const unselectedPillClasses = 'hover:bg-blue-lighter text-blue';

  const leftPillClasses = cx(
    basePillClasses,
    'rounded-l-lg border-t border-l border-b', {
      [selectedPillClasses]: isRoot,
      [unselectedPillClasses]: !isRoot
    }
  );

  const rightPillClasses = cx(
    basePillClasses,
    'rounded-r-lg border-t border-r border-b', {
      [selectedPillClasses]: isSummary,
      [unselectedPillClasses]: !isSummary
    }
  );

  return (
    <ul className="list-reset flex">
      <li
        className="flex-1"
      >
        <Link
          className={leftPillClasses}
          to={{ ...location, pathname: '/entries' }}
        >
          <FontAwesomeIcon
            icon="list"
          />
          {' '}
          {'List'}
        </Link>
      </li>
      <li
        className="flex-1"
      >
        <Link
          className={rightPillClasses}
          to={{ ...location, pathname: '/entries/summary' }}
        >
          <FontAwesomeIcon
            icon="layer-group"
          />
          {' '}
          {'Summary'}
        </Link>
      </li>
    </ul>
  );
};

EntriesIndexMenu.propTypes = {
  location: PropTypes.routerLocation.isRequired
};

export default EntriesIndexMenu;
