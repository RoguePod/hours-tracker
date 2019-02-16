import PropTypes from "javascripts/prop-types";
import React from "react";
import { Table } from "javascripts/shared/components";
import _times from "lodash/times";
import moment from "moment-timezone";

class UsersFooter extends React.Component {
  static propTypes = {
    endMonth: PropTypes.instanceOf(moment).isRequired,
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    startMonth: PropTypes.instanceOf(moment).isRequired,
    timezone: PropTypes.string.isRequired
  };

  shouldComponentUpdate() {
    return true;
  }

  _calcTotal(billable, format, value) {
    const { entries } = this.props;

    let sum = 0.0;

    for (const entry of entries) {
      if (billable && !entry.billable) {
        continue;
      }

      const startedAt = moment.tz(entry.startedAt, entry.timezone);
      const entryValue = startedAt.format(format);

      if (value && value !== entryValue) {
        continue;
      }

      let stoppedAt = null;

      if (entry.stoppedAt) {
        stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
      } else {
        stoppedAt = moment().tz(entry.timezone);
      }

      const hours = stoppedAt.diff(startedAt, "hours", true);

      sum += hours;
    }

    return sum;
  }

  _getCellsAndWeekTotals(query, timezone) {
    const billableCells = [];
    const totalCells = [];

    let weekBillableTotal = 0;
    let weekTotal = 0;

    _times(7, index => {
      const day = moment
        .tz(query.date, timezone)
        .add(index, "d")
        .format("YYYY-MM-DD");

      const billableTotal = this._calcTotal(true, "YYYY-MM-DD", day);
      const total = this._calcTotal(false, "YYYY-MM-DD", day);

      weekBillableTotal += billableTotal;
      weekTotal += total;

      billableCells.push(
        <Table.Td className="w-px" key={day}>
          <strong className="text-green">{billableTotal.toFixed(1)}</strong>
        </Table.Td>
      );

      totalCells.push(
        <Table.Td className="w-px" key={day}>
          <strong className="text-blue">{total.toFixed(1)}</strong>
        </Table.Td>
      );
    });

    return { billableCells, totalCells, weekBillableTotal, weekTotal };
  }

  _getMonthAndOtherTotals(startMonth, endMonth) {
    const diffMonth = startMonth.format("MMM") !== endMonth.format("MMM");
    const monthTotal = this._calcTotal(
      false,
      "YYYY-MM",
      startMonth.format("YYYY-MM")
    );
    let otherTotal = null;

    const monthBillableTotal = this._calcTotal(
      true,
      "YYYY-MM",
      startMonth.format("YYYY-MM")
    );
    let otherBillableTotal = null;

    if (diffMonth) {
      otherTotal = this._calcTotal(
        false,
        "YYYY-MM",
        endMonth.format("YYYY-MM")
      );
      otherBillableTotal = this._calcTotal(
        true,
        "YYYY-MM",
        endMonth.format("YYYY-MM")
      );
    }

    return {
      diffMonth,
      monthBillableTotal,
      monthTotal,
      otherBillableTotal,
      otherTotal
    };
  }

  render() {
    const { endMonth, query, startMonth, timezone } = this.props;

    const {
      billableCells,
      totalCells,
      weekBillableTotal,
      weekTotal
    } = this._getCellsAndWeekTotals(query, timezone);

    const {
      diffMonth,
      monthBillableTotal,
      monthTotal,
      otherBillableTotal,
      otherTotal
    } = this._getMonthAndOtherTotals(startMonth, endMonth);

    return (
      <tfoot>
        <tr className="bg-blue-lightest">
          <Table.Td className="text-right">
            <strong className="text-green">{"Billable"}</strong>
          </Table.Td>
          {billableCells}
          <Table.Td className="w-px">
            <strong className="text-green">
              {weekBillableTotal.toFixed(1)}
            </strong>
          </Table.Td>
          <Table.Td className="w-px bg-blue-lighter">
            <strong className="text-green">
              {monthBillableTotal.toFixed(1)}
            </strong>
          </Table.Td>
          {diffMonth && (
            <Table.Td className="w-px bg-blue-lighter">
              <strong className="text-green">
                {otherBillableTotal.toFixed(1)}
              </strong>
            </Table.Td>
          )}
        </tr>
        <tr className="bg-blue-lightest">
          <Table.Td className="text-right">
            <strong className="text-blue">{"Total"}</strong>
          </Table.Td>
          {totalCells}
          <Table.Td className="w-px">
            <strong className="text-blue">{weekTotal.toFixed(1)}</strong>
          </Table.Td>
          <Table.Td className="w-px bg-blue-lighter">
            <strong className="text-blue">{monthTotal.toFixed(1)}</strong>
          </Table.Td>
          {diffMonth && (
            <Table.Td className="w-px bg-blue-lighter">
              <strong className="text-blue">{otherTotal.toFixed(1)}</strong>
            </Table.Td>
          )}
        </tr>
      </tfoot>
    );
  }
}

export default UsersFooter;
