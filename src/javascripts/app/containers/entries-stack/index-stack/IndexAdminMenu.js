import ExportEntriesButton from './ExportEntriesButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const EntriesIndexAdminMenu = ({ location, query, timezone }) => {
  const { pathname } = location;

  const isReports        = pathname === '/entries/reports';
  const isReportsSummary = pathname === '/entries/reports/summary';

  const basePillClasses =
    'block py-2 px-2 text-center border-r cursor-pointer ' +
    'flex flex-no-wrap flex-1';
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
    <div className="flex">
      <Link
        className={leftPillClasses}
        to={{ ...location, pathname: '/entries/reports' }}
      >
        <FontAwesomeIcon
          icon="list"
        />
        <div className="ml-2">
          {'List'}
        </div>
      </Link>
      <Link
        className={summaryPillClasses}
        to={{ ...location, pathname: '/entries/reports/summary' }}
      >
        <FontAwesomeIcon
          icon="layer-group"
        />
        <div className="ml-2">
          {'Summary'}
        </div>
      </Link>
      <ExportEntriesButton
        className={middlePillClasses}
        func="entriesCsv"
        query={query}
        timezone={timezone}
        title="Entries CSV"
      />
      <ExportEntriesButton
        className={middlePillClasses}
        func="billableCsv"
        query={query}
        timezone={timezone}
        title="Billable CSV"
      />
      <ExportEntriesButton
        className={rightPillClasses}
        func="payrollCsv"
        query={query}
        timezone={timezone}
        title="Payroll CSV"
      />
    </div>
  );
};

EntriesIndexAdminMenu.propTypes = {
  location: PropTypes.routerLocation.isRequired,
  query: PropTypes.entriesQuery.isRequired,
  timezone: PropTypes.string.isRequired
};

export default EntriesIndexAdminMenu;
