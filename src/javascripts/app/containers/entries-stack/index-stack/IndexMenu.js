import { Dropdown, Icon, Menu } from 'semantic-ui-react';

import ExportEntriesButton from './ExportEntriesButton';
import { Link } from 'react-router-dom';
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
      <Menu.Menu
        position="right"
      >
        <Menu.Item
          header
        >
          <Icon name="users" />
          {'Reports'}
        </Menu.Item>
        <Menu.Item
          active={isReports}
          as={Link}
          icon="list"
          name="List"
          to={{ ...location, pathname: '/entries/reports' }}
        />
        <Menu.Item
          active={isReportsSummary}
          as={Link}
          icon="table"
          name="Summary"
          to={{ ...location, pathname: '/entries/reports/summary' }}
        />
        <Dropdown
          item
          text="Export"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              as={ExportEntriesButton}
              func="entriesCsv"
              query={rawQuery}
              timezone={timezone}
              title="Entries CSV"
            />
            <Dropdown.Item
              as={ExportEntriesButton}
              func="billableCsv"
              query={rawQuery}
              timezone={timezone}
              title="Billable CSV"
            />
            <Dropdown.Item
              as={ExportEntriesButton}
              func="payrollCsv"
              query={rawQuery}
              timezone={timezone}
              title="Payroll CSV"
            />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
    );
  }
  /* eslint-enable max-lines-per-function */

  render() {
    const { admin, location } = this.props;
    const { pathname } = location;

    const isRoot    = pathname === '/entries';
    const isSummary = pathname === '/entries/summary';

    return (
      <Menu
        color="blue"
        stackable
      >
        <Menu.Item
          active={isRoot}
          as={Link}
          icon="list"
          name="List"
          to={{ ...location, pathname: '/entries' }}
        />
        <Menu.Item
          active={isSummary}
          as={Link}
          icon="table"
          name="Summary"
          to={{ ...location, pathname: '/entries/summary' }}
        />
        {admin && this._renderAdminMenu()}
      </Menu>
    );
  }
}

export default EntriesIndexStack;
