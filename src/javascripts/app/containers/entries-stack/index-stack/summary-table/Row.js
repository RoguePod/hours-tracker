import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'javascripts/shared/components';

class Row extends React.Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    name: PropTypes.string.isRequired
  };

  shouldComponentUpdate() {
    return true;
  }

  _calcBillable() {
    const { entries } = this.props;

    let sum = 0.0;

    for (const entry of entries) {
      if (entry.billable) {
        sum += entry.hours;
      }
    }

    return sum;
  }

  _calcNonBillable() {
    const { entries } = this.props;

    let sum = 0.0;

    for (const entry of entries) {
      if (!entry.billable) {
        sum += entry.hours;
      }
    }

    return sum;
  }

  _calcTotal() {
    const { entries } = this.props;

    let sum = 0.0;

    for (const entry of entries) {
      sum += entry.hours;
    }

    return sum;
  }

  _calcPercentBillable() {
    const total = this._calcTotal();

    if (total === 0) {
      return 0;
    }

    return this._calcBillable() / total;
  }

  render() {
    const { name } = this.props;

    return (
      <tr>
        <Table.Td>{name}</Table.Td>
        <Table.Td className="text-green">
          {this._calcBillable().toFixed(1)}
        </Table.Td>
        <Table.Td>{this._calcNonBillable().toFixed(1)}</Table.Td>
        <Table.Td className="w-px whitespace-no-wrap">
          {this._calcTotal().toFixed(1)}
        </Table.Td>
        <Table.Td>{`${(this._calcPercentBillable() * 100).toFixed(
          2
        )}%`}</Table.Td>
      </tr>
    );
  }
}

export default Row;
