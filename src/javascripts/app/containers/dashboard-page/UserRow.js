import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'javascripts/shared/components';
import _times from 'lodash/times';
import moment from 'moment-timezone';

class UsersRow extends React.Component {
  static propTypes = {
    endMonth: PropTypes.instanceOf(moment).isRequired,
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    startMonth: PropTypes.instanceOf(moment).isRequired,
    timezone: PropTypes.string.isRequired,
    user: PropTypes.user.isRequired
  };

  shouldComponentUpdate() {
    return true;
  }

  _calcTotal(format, value) {
    const { entries, user } = this.props;

    let sum = 0.0;

    for (const entry of entries) {
      if (entry.user.id !== user.id) {
        continue;
      }

      const startedAt = moment.tz(entry.startedAt, entry.timezone);
      const entryValue = startedAt.format(format);

      if (value !== entryValue) {
        continue;
      }

      let stoppedAt = null;

      if (entry.stoppedAt) {
        stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
      } else {
        stoppedAt = moment().tz(entry.timezone);
      }

      const hours = stoppedAt.diff(startedAt, 'hours', true);

      sum += hours;
    }

    return sum;
  }

  _getCellsAndWeekTotal(query, timezone) {
    const cells = [];
    let weekTotal = 0;

    _times(7, (index) => {
      const day = moment
        .tz(query.date, timezone)
        .add(index, 'd')
        .format('YYYY-MM-DD');

      const dayTotal = this._calcTotal('YYYY-MM-DD', day);

      weekTotal += dayTotal;

      cells.push(
        <Table.Td className="w-px" key={day}>
          {dayTotal.toFixed(1)}
        </Table.Td>
      );
    });

    return { cells, weekTotal };
  }

  render() {
    const { endMonth, query, startMonth, timezone, user } = this.props;

    const { cells, weekTotal } = this._getCellsAndWeekTotal(query, timezone);

    const diffMonth = startMonth.format('MMM') !== endMonth.format('MMM');
    const monthTotal = this._calcTotal('YYYY-MM', startMonth.format('YYYY-MM'));
    let otherTotal = null;

    if (diffMonth) {
      otherTotal = this._calcTotal('YYYY-MM', endMonth.format('YYYY-MM'));
    }

    return (
      <tr>
        <Table.Td>{user.name}</Table.Td>
        {cells}
        <Table.Td className="w-px">{weekTotal.toFixed(1)}</Table.Td>
        <Table.Td className="w-px bg-blue-lighter">
          {monthTotal.toFixed(1)}
        </Table.Td>
        {diffMonth && (
          <Table.Td className="w-px bg-blue-lighter">
            {otherTotal.toFixed(1)}
          </Table.Td>
        )}
      </tr>
    );
  }
}

export default UsersRow;
