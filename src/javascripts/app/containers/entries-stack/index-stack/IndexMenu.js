import ExportEntriesButton from './ExportEntriesButton';
import { Pill } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class EntriesIndexStack extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    location: PropTypes.routerLocation.isRequired,
    rawQuery: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired
  }

  shouldComponentUpdate() {
    return true;
  }

  /* eslint-disable max-lines-per-function */
  _renderAdminMenu() {
    const { location, rawQuery, timezone } = this.props;
    const { pathname } = location;

    const isReports        = pathname === '/entries/reports';
    const isReportsSummary = pathname === '/entries/reports/summary';

    return (
      <ul className="list-reset flex flex-row">
        <li
          className="mr-3"
        >
          <Pill
            selected={isReports}
            to={{ ...location, pathname: '/entries/reports' }}
          >
            {'List'}
          </Pill>
        </li>
        <li
          className="mr-3"
        >
          <Pill
            selected={isReportsSummary}
            to={{ ...location, pathname: '/entries/reports/summary' }}
          >
            {'Summary'}
          </Pill>
        </li>
        <li
          className="mr-3"
        >
          <ExportEntriesButton
            func="entriesCsv"
            query={rawQuery}
            timezone={timezone}
            title="Entries CSV"
          />
        </li>
        <li
          className="mr-3"
        >
          <ExportEntriesButton
            func="billableCsv"
            query={rawQuery}
            timezone={timezone}
            title="Billable CSV"
          />
        </li>
        <li>
          <ExportEntriesButton
            func="payrollCsv"
            query={rawQuery}
            timezone={timezone}
            title="Payroll CSV"
          />
        </li>
      </ul>
    );
  }
  /* eslint-enable max-lines-per-function */

  render() {
    const { admin, location } = this.props;
    const { pathname } = location;

    const isRoot    = pathname === '/entries';
    const isSummary = pathname === '/entries/summary';

    return (
      <div
        className="flex flex-wrap justify-between flex-row items-center my-4"
      >
        <ul className="list-reset flex flex-row">
          <li
            className="mr-3"
          >
            <Pill
              selected={isRoot}
              to={{ ...location, pathname: '/entries' }}
            >
              {'List'}
            </Pill>
          </li>
          <li>
            <Pill
              selected={isSummary}
              to={{ ...location, pathname: '/entries/summary' }}
            >
              {'Summary'}
            </Pill>
          </li>
        </ul>
        {admin && this._renderAdminMenu()}
      </div>
    );
  }
}

export default EntriesIndexStack;
