import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Row from './Row';

class UsersTable extends React.Component {
  static propTypes = {
    users: PropTypes.object.isRequired
  }

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

    return keys.map((key) => {
      return (
        <Row
          entries={users[key]}
          key={key}
          name={key}
        />
      );
    });
  }

  render() {
    return (
      <>
        <thead>
          <tr>
            <th />
            <th>
              {'Billable'}
            </th>
            <th>
              {'Non-Billable'}
            </th>
            <th>
              {'Total'}
            </th>
            <th>
              {'Billable %'}
            </th>
          </tr>
        </thead>
        <tbody>
          {this._renderRows()}
          <tr>
            <td />
            <td className="text-green">
              {this._calcBillable().toFixed(1)}
            </td>
            <td>
              {this._calcNonBillable().toFixed(1)}
            </td>
            <td className="w-px whitespace-no-wrap">
              {this._calcTotal().toFixed(1)}
            </td>
            <td>
              {`${(this._calcPercentBillable() * 100).toFixed(2)}%`}
            </td>
          </tr>
        </tbody>
      </>
    );
  }
}

export default UsersTable;
