import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'javascripts/shared/components';
import _get from 'lodash/get';
import _times from 'lodash/times';
import cx from 'classnames';
import moment from 'moment-timezone';

class ProjectRow extends React.Component {
  static propTypes = {
    client: PropTypes.client,
    endMonth: PropTypes.instanceOf(moment).isRequired,
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    project: PropTypes.project,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    startMonth: PropTypes.instanceOf(moment).isRequired,
    timezone: PropTypes.string.isRequired,
    user: PropTypes.user
  };

  static defaultProps = {
    user: null
  };

  static defaultProps = {
    client: null,
    project: null
  };

  shouldComponentUpdate() {
    return true;
  }

  _calcTotal(format, value) {
    const { entries, project, user } = this.props;

    let sum = 0.0;

    for (const entry of entries) {
      if (user && entry.user.id !== user.id) {
        continue;
      }

      if (_get(entry, 'project.id', null) !== _get(project, 'id', null)) {
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

      const total = this._calcTotal('YYYY-MM-DD', day);

      weekTotal += total;

      cells.push(
        <Table.Td className="w-px" key={day}>
          {total.toFixed(1)}
        </Table.Td>
      );
    });

    return { cells, weekTotal };
  }

  _getMonthAndOtherTotals(startMonth, endMonth) {
    const diffMonth = startMonth.format('MMM') !== endMonth.format('MMM');
    const monthTotal = this._calcTotal('YYYY-MM', startMonth.format('YYYY-MM'));
    let otherTotal = null;

    if (diffMonth) {
      otherTotal = this._calcTotal('YYYY-MM', endMonth.format('YYYY-MM'));
    }

    return { diffMonth, monthTotal, otherTotal };
  }

  render() {
    const {
      client,
      endMonth,
      project,
      query,
      startMonth,
      timezone
    } = this.props;

    const { cells, weekTotal } = this._getCellsAndWeekTotal(query, timezone);
    const { diffMonth, monthTotal, otherTotal } = this._getMonthAndOtherTotals(
      startMonth,
      endMonth
    );

    const cellClass = cx({
      'text-green-500': project && project.billable,
      'text-red-500': !project
    });

    return (
      <tr>
        <Table.Td className={cellClass}>
          {_get(client, 'name', 'No Client')}
        </Table.Td>
        <Table.Td className={cellClass}>
          {_get(project, 'name', 'No Project')}
        </Table.Td>
        {cells}
        <Table.Td className="w-px">{weekTotal.toFixed(1)}</Table.Td>
        <Table.Td className="w-px bg-blue-300">
          {monthTotal.toFixed(1)}
        </Table.Td>
        {diffMonth && (
          <Table.Td className="w-px bg-blue-300">
            {otherTotal.toFixed(1)}
          </Table.Td>
        )}
      </tr>
    );
  }
}

export default ProjectRow;
