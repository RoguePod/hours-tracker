import PropTypes from "javascripts/prop-types";
import React from "react";
import Row from "./Row";
import { Table } from "javascripts/shared/components";

class UsersTable extends React.Component {
  static propTypes = {
    /* eslint-disable react/forbid-prop-types */
    users: PropTypes.object.isRequired
    /* eslint-enable react/forbid-prop-types */
  };

  shouldComponentUpdate() {
    return true;
  }

  _calcBillable() {
    const { users } = this.props;

    let sum = 0.0;

    for (const key of Object.keys(users)) {
      for (const entry of users[key]) {
        if (entry.billable) {
          sum += entry.hours;
        }
      }
    }

    return sum;
  }

  _calcNonBillable() {
    const { users } = this.props;

    let sum = 0.0;

    for (const key of Object.keys(users)) {
      for (const entry of users[key]) {
        if (!entry.billable) {
          sum += entry.hours;
        }
      }
    }

    return sum;
  }

  _calcTotal() {
    const { users } = this.props;

    let sum = 0.0;

    for (const key of Object.keys(users)) {
      for (const entry of users[key]) {
        sum += entry.hours;
      }
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

  _renderRows() {
    const { users } = this.props;

    const keys = Object.keys(users).sort();

    return keys.map(key => {
      return <Row entries={users[key]} key={key} name={key} />;
    });
  }

  render() {
    return (
      <>
        <thead>
          <tr>
            <Table.Td />
            <Table.Td>{"Billable"}</Table.Td>
            <Table.Td>{"Non-Billable"}</Table.Td>
            <Table.Td>{"Total"}</Table.Td>
            <Table.Td>{"Billable %"}</Table.Td>
          </tr>
        </thead>
        <tbody>
          {this._renderRows()}
          <tr>
            <Table.Td />
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
        </tbody>
      </>
    );
  }
}

export default UsersTable;
