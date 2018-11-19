import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _times from 'lodash/times';
import moment from 'moment-timezone';

class ProjectsFooter extends React.Component {
  static propTypes = {
    endMonth: PropTypes.instanceOf(moment).isRequired,
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    startMonth: PropTypes.instanceOf(moment).isRequired,
    timezone: PropTypes.string.isRequired,
    user: PropTypes.user
  }

  static defaultProps = {
    user: null
  }

  shouldComponentUpdate() {
    return true;
  }

  _calcTotal(billable, format, value) {
    const { entries, user } = this.props;

    let sum = 0.0;

    for (const entry of entries) {
      if (user && entry.user.id !== user.id) {
        continue;
      }

      if (billable && !entry.billable) {
        continue;
      }

      const startedAt  = moment.tz(entry.startedAt, entry.timezone);
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

  _getCellsAndWeekTotals(query, timezone) {
    const billableCells = [];
    const totalCells    = [];

    let weekBillableTotal = 0;
    let weekTotal = 0;

    _times(7, (index) => {
      const day = moment.tz(query.date, timezone)
        .add(index, 'd')
        .format('YYYY-MM-DD');

      const billableTotal = this._calcTotal(true, 'YYYY-MM-DD', day);
      const total         = this._calcTotal(false, 'YYYY-MM-DD', day);

      weekBillableTotal += billableTotal;
      weekTotal += total;

      billableCells.push(
        <th
          className="w-px"
          key={day}
        >
          <strong className="text-green">
            {billableTotal.toFixed(1)}
          </strong>
        </th>
      );

      totalCells.push(
        <th
          className="w-px"
          key={day}
        >
          <strong className="text-blue">
            {total.toFixed(1)}
          </strong>
        </th>
      );
    });

    return { billableCells, totalCells, weekBillableTotal, weekTotal };
  }

  _getMonthTotalAndOtherTotals(startMonth, endMonth) {
    const diffMonth = startMonth.format('MMM') !== endMonth.format('MMM');
    const monthTotal = this._calcTotal(
      false, 'YYYY-MM', startMonth.format('YYYY-MM')
    );
    let otherTotal = null;

    const monthBillableTotal = this._calcTotal(
      true, 'YYYY-MM', startMonth.format('YYYY-MM')
    );
    let otherBillableTotal = null;

    if (diffMonth) {
      otherTotal = this._calcTotal(
        false, 'YYYY-MM', endMonth.format('YYYY-MM')
      );
      otherBillableTotal = this._calcTotal(
        true, 'YYYY-MM', endMonth.format('YYYY-MM')
      );
    }

    return {
      diffMonth, monthBillableTotal, monthTotal, otherBillableTotal, otherTotal
    };
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const { endMonth, query, startMonth, timezone } = this.props;

    const {
      billableCells, totalCells, weekBillableTotal, weekTotal
    } = this._getCellsAndWeekTotals(query, timezone);

    const {
      diffMonth, monthBillableTotal, monthTotal, otherBillableTotal, otherTotal
    } = this._getMonthTotalAndOtherTotals(startMonth, endMonth);

    return (
      <tfoot>
        <tr className="bg-blue-lightest">
          <th
            className="text-right"
            colSpan="2"
          >
            <strong className="text-green">
              {'Billable'}
            </strong>
          </th>
          {billableCells}
          <th className="w-px">
            <strong className="text-green">
              {weekBillableTotal.toFixed(1)}
            </strong>
          </th>
          <th className="w-px bg-blue-lighter">
            <strong className="text-green">
              {monthBillableTotal.toFixed(1)}
            </strong>
          </th>
          {diffMonth &&
            <th className="w-px bg-blue-lighter">
              <strong className="text-green">
                {otherBillableTotal.toFixed(1)}
              </strong>
            </th>}
        </tr>
        <tr className="bg-blue-lightest">
          <th
            className="text-right"
            colSpan="2"
          >
            <strong className="text-blue">
              {'Total'}
            </strong>
          </th>
          {totalCells}
          <th className="w-px">
            <strong className="text-blue">
              {weekTotal.toFixed(1)}
            </strong>
          </th>
          <th className="w-px bg-blue-lighter">
            <strong className="text-blue">
              {monthTotal.toFixed(1)}
            </strong>
          </th>
          {diffMonth &&
            <th className="w-px bg-blue-lighter">
              <strong className="text-blue">
                {otherTotal.toFixed(1)}
              </strong>
            </th>}
        </tr>
      </tfoot>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default ProjectsFooter;
