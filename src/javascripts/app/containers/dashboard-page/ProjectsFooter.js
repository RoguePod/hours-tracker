import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import _times from 'lodash/times';
import moment from 'moment-timezone';
import styles from './ProjectsFooter.scss';

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
        <Table.HeaderCell
          collapsing
          key={day}
        >
          <strong className={styles.billable}>
            {billableTotal.toFixed(1)}
          </strong>
        </Table.HeaderCell>
      );

      totalCells.push(
        <Table.HeaderCell
          collapsing
          key={day}
        >
          <strong className={styles.total}>
            {total.toFixed(1)}
          </strong>
        </Table.HeaderCell>
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
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell
            colSpan="2"
            textAlign="right"
          >
            <strong className={styles.billable}>
              {'Billable'}
            </strong>
          </Table.HeaderCell>
          {billableCells}
          <Table.HeaderCell
            collapsing
          >
            <strong className={styles.billable}>
              {weekBillableTotal.toFixed(1)}
            </strong>
          </Table.HeaderCell>
          <Table.HeaderCell
            className={styles.totalCell}
            collapsing
          >
            <strong className={styles.billable}>
              {monthBillableTotal.toFixed(1)}
            </strong>
          </Table.HeaderCell>
          {diffMonth &&
            <Table.HeaderCell
              className={styles.totalCell}
              collapsing
            >
              <strong className={styles.billable}>
                {otherBillableTotal.toFixed(1)}
              </strong>
            </Table.HeaderCell>}
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell
            colSpan="2"
            textAlign="right"
          >
            <strong className={styles.total}>
              {'Total'}
            </strong>
          </Table.HeaderCell>
          {totalCells}
          <Table.HeaderCell
            collapsing
          >
            <strong className={styles.total}>
              {weekTotal.toFixed(1)}
            </strong>
          </Table.HeaderCell>
          <Table.HeaderCell
            className={styles.totalCell}
            collapsing
          >
            <strong className={styles.total}>
              {monthTotal.toFixed(1)}
            </strong>
          </Table.HeaderCell>
          {diffMonth &&
            <Table.HeaderCell
              className={styles.totalCell}
              collapsing
            >
              <strong className={styles.total}>
                {otherTotal.toFixed(1)}
              </strong>
            </Table.HeaderCell>}
        </Table.Row>
      </Table.Footer>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default ProjectsFooter;
