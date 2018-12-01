import ExportEntriesButton from './ExportEntriesButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const EntriesIndexAdminMenu = ({ location, rawQuery, timezone }) => {
  const { pathname } = location;

  const isReports        = pathname === '/entries/reports';
  const isReportsSummary = pathname === '/entries/reports/summary';

  const basePillClasses       = 'block py-2 px-4 text-center border-r';
  const selectedPillClasses   = 'bg-blue text-white border-blue';
  const unselectedPillClasses = 'hover:bg-blue-lighter text-blue';

  const leftPillClasses = cx(
    basePillClasses,
    'rounded-l-lg border-t border-l border-b', {
      [selectedPillClasses]: isReports,
      [unselectedPillClasses]: !isReports
    }
  );

  const summaryPillClasses = cx(
    basePillClasses,
    'border-t border-b', {
      [selectedPillClasses]: isReportsSummary,
      [unselectedPillClasses]: !isReportsSummary
    }
  );

  const middlePillClasses = cx(
    basePillClasses, unselectedPillClasses, 'border-t border-b'
  );

  const rightPillClasses = cx(
    basePillClasses, unselectedPillClasses,
    'rounded-r-lg border-t border-b'
  );

  return (
    <ul className="list-reset flex">
      <li className="flex-1">
        <Link
          className={leftPillClasses}
          to={{ ...location, pathname: '/entries/reports' }}
        >
          <FontAwesomeIcon
            icon="list"
          />
          {' '}
          {'List'}
        </Link>
      </li>
      <li className="flex-1">
        <Link
          className={summaryPillClasses}
          to={{ ...location, pathname: '/entries/reports/summary' }}
        >
          <FontAwesomeIcon
            icon="layer-group"
          />
          {' '}
          {'Summary'}
        </Link>
      </li>
      <li className="flex-1">
        <ExportEntriesButton
          className={middlePillClasses}
          func="entriesCsv"
          query={rawQuery}
          timezone={timezone}
          title="Entries CSV"
        />
      </li>
      <li className="flex-1">
        <ExportEntriesButton
          className={middlePillClasses}
          func="billableCsv"
          query={rawQuery}
          timezone={timezone}
          title="Billable CSV"
        />
      </li>
      <li className="flex-1">
        <ExportEntriesButton
          className={rightPillClasses}
          func="payrollCsv"
          query={rawQuery}
          timezone={timezone}
          title="Payroll CSV"
        />
      </li>
    </ul>
  );
};

EntriesIndexAdminMenu.propTypes = {
  location: PropTypes.routerLocation.isRequired,
  rawQuery: PropTypes.entriesQuery.isRequired,
  timezone: PropTypes.string.isRequired
};

export default EntriesIndexAdminMenu;
