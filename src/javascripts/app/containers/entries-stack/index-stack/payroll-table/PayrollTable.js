import {
  selectEntriesWithHours, selectQuery, subscribeEntries
} from 'javascripts/app/redux/entries';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import _first from 'lodash/first';
import _groupBy from 'lodash/groupBy';
import _isEqual from 'lodash/isEqual';
import _last from 'lodash/last';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { selectTimezone } from 'javascripts/app/redux/app';
import styles from './PayrollTable.scss';

class EntriesPayrollTable extends React.Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    location: PropTypes.routerLocation.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired
  }

  componentDidMount() {
    const { onSubscribeEntries } = this.props;

    onSubscribeEntries(null);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { onSubscribeEntries, location: { pathname }, query } = this.props;

    if (pathname !== prevProps.location.pathname ||
        !_isEqual(query, prevProps.query)) {
      onSubscribeEntries(null);
    }
  }

  _renderUserCells(weeks, entries, overtime) {
    let weekTotal = 0;

    const cells = weeks.map((week) => {
      const startValue = week.start.valueOf();
      const endValue   = week.end.valueOf();

      let total = 0;

      for (const entry of entries) {
        if (entry.startedAt >= startValue && entry.startedAt <= endValue) {
          total += entry.hours;
        }
      }

      if (overtime) {
        if (total > 40) {
          total -= 40;
        } else {
          total = 0;
        }
      } else if (total > 40) {
        total = 40;
      }

      weekTotal += total;

      return (
        <Table.Cell
          key={`${startValue}-${endValue}-${overtime}`}
        >
          {total.toFixed(1)}
        </Table.Cell>
      );
    });

    cells.push(
      <Table.Cell
        key={`total-${overtime ? 1 : 0}`}
      >
        {weekTotal.toFixed(1)}
      </Table.Cell>
    );

    return cells;
  }

  /* eslint-disable max-statements */
  render() {
    const { entries, timezone } = this.props;

    if (entries.length === 0) {
      return null;
    }

    const startDate = moment.tz(_last(entries).startedAt, timezone)
      .startOf('isoWeek');
    const endDate   = moment.tz(_first(entries).startedAt, timezone)
      .endOf('isoWeek');

    const weeks = [];
    while (startDate.isBefore(endDate)) {
      weeks.push({
        end: startDate.clone().add(6, 'd')
          .endOf('day'),
        start: startDate.clone()
      });

      startDate.add(1, 'w');
    }

    const headerRow = (
      <Table.Row>
        <Table.HeaderCell />
        {weeks.map((week) => {
          const range =
            `${week.start.format('MM/DD')} - ${week.end.format('MM/DD')}`;
          return (
            <Table.HeaderCell key={`${range}-0`}>
              {range}
            </Table.HeaderCell>
          );
        })}
        <Table.HeaderCell>
          {'Overtime Total'}
        </Table.HeaderCell>
        <Table.HeaderCell />
        {weeks.map((week) => {
          const range =
            `${week.start.format('MM/DD')} - ${week.end.format('MM/DD')}`;
          return (
            <Table.HeaderCell key={`${range}-1`}>
              {range}
            </Table.HeaderCell>
          );
        })}
        <Table.HeaderCell>
          {'Regular Total'}
        </Table.HeaderCell>
      </Table.Row>
    );

    const users = _groupBy(entries, (entry) => entry.user.name);

    const rows = [];
    for (const userName of Object.keys(users).sort()) {
      rows.push(
        <Table.Row key={userName}>
          <Table.Cell>
            {userName}
          </Table.Cell>
          {this._renderUserCells(weeks, users[userName], true)}
          <Table.Cell />
          {this._renderUserCells(weeks, users[userName], false)}
        </Table.Row>
      );
    }

    return (
      <div className={styles.container}>
        <Table
          celled
          selectable
          unstackable
        >
          <Table.Header>
            {headerRow}
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const props = (state) => {
  return {
    entries: selectEntriesWithHours(state),
    query: selectQuery(state),
    timezone: selectTimezone(state)
  };
};

const actions = {
  onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(EntriesPayrollTable);
