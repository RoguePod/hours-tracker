import {
  selectEntriesWithHours,
  selectQuery,
  subscribeEntries
} from 'javascripts/app/redux/entries';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
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
        <td
          key={`${startValue}-${endValue}-${overtime}`}
        >
          {total.toFixed(1)}
        </td>
      );
    });

    cells.push(
      <td
        key={`total-${overtime ? 1 : 0}`}
      >
        {weekTotal.toFixed(1)}
      </td>
    );

    return cells;
  }

  _renderHeaderRow(weeks) {
    return (
      <tr>
        <th />
        {weeks.map((week) => {
          const range =
            `${week.start.format('MM/DD')} - ${week.end.format('MM/DD')}`;
          return (
            <th key={`${range}-0`}>
              {range}
            </th>
          );
        })}
        <th>
          {'Overtime Total'}
        </th>
        <th />
        {weeks.map((week) => {
          const range =
            `${week.start.format('MM/DD')} - ${week.end.format('MM/DD')}`;
          return (
            <th key={`${range}-1`}>
              {range}
            </th>
          );
        })}
        <th>
          {'Regular Total'}
        </th>
      </tr>
    );
  }

  _renderRows(weeks, entries) {
    const users = _groupBy(entries, (entry) => entry.user.name);
    const rows  = [];

    for (const userName of Object.keys(users).sort()) {
      rows.push(
        <tr key={userName}>
          <td>
            {userName}
          </td>
          {this._renderUserCells(weeks, users[userName], true)}
          <td />
          {this._renderUserCells(weeks, users[userName], false)}
        </tr>
      );
    }

    return rows;
  }

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

    return (
      <div className={styles.container}>
        <table
          celled
          selectable
          unstackable
        >
          <thead>
            {this._renderHeaderRow(weeks)}
          </thead>
          <tbody>
            {this._renderRows(weeks, entries)}
          </tbody>
        </table>
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
