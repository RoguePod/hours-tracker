import { Dropdown } from 'javascripts/shared/components';
import ExportEntriesButton from './ExportEntriesButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const EntriesIndexAdminMenu = ({ location, query, timezone }) => {
  const { pathname } = location;

  const [open, setOpen] = React.useState(false);
  const target = React.useRef(null);

  const isReports = pathname === '/entries/reports';
  const isReportsSummary = pathname === '/entries/reports/summary';

  const basePillClasses = 'block py-2 px-4 text-center';
  const selectedPillClasses = 'bg-blue-500 text-white border-blue-500';
  const unselectedPillClasses = 'hover:bg-blue-300 text-blue-500';

  const leftPillClasses = cx(
    basePillClasses,
    'rounded-l-lg border-t border-l border-b',
    {
      [selectedPillClasses]: isReports,
      [unselectedPillClasses]: !isReports
    }
  );

  const middlePillClasses = cx(basePillClasses, 'border', {
    [selectedPillClasses]: isReportsSummary,
    [unselectedPillClasses]: !isReportsSummary
  });

  const rightPillClasses = cx(
    basePillClasses,
    unselectedPillClasses,
    'rounded-r-lg border-t border-r border-b cursor-pointer'
  );

  const _handleOpen = () => {
    setOpen(!open);
  };

  return (
    <ul className="flex">
      <li className="flex-1">
        <Link
          className={leftPillClasses}
          to={{ ...location, pathname: '/entries/reports' }}
        >
          <FontAwesomeIcon icon="list" /> {'List'}
        </Link>
      </li>
      <li className="flex-1">
        <Link
          className={middlePillClasses}
          to={{ ...location, pathname: '/entries/reports/summary' }}
        >
          <FontAwesomeIcon icon="layer-group" /> {'Summary'}
        </Link>
      </li>
      <li className="flex-1 relative" ref={target}>
        <div
          className={rightPillClasses}
          onClick={_handleOpen}
          role="button"
          tabIndex="-1"
        >
          <FontAwesomeIcon icon="download" /> {'Download'}
        </div>

        <Dropdown onClose={_handleOpen} open={open} target={target}>
          <ExportEntriesButton
            className="border-b"
            func="entriesCsv"
            query={query}
            timezone={timezone}
            title="Entries CSV"
          />
          <ExportEntriesButton
            className="border-b"
            func="billableCsv"
            query={query}
            timezone={timezone}
            title="Billable CSV"
          />
          <ExportEntriesButton
            func="payrollCsv"
            query={query}
            timezone={timezone}
            title="Payroll CSV"
          />
        </Dropdown>
      </li>
    </ul>
  );
};

EntriesIndexAdminMenu.propTypes = {
  location: PropTypes.routerLocation.isRequired,
  query: PropTypes.entriesQuery.isRequired,
  timezone: PropTypes.string.isRequired
};

export default EntriesIndexAdminMenu;
