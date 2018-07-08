import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Row from './Row';
import { Table } from 'semantic-ui-react';

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
    return [
      <Table.Header
        key="users-header"
      >
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>
            {'Billable'}
          </Table.HeaderCell>
          <Table.HeaderCell>
            {'Non-Billable'}
          </Table.HeaderCell>
          <Table.HeaderCell>
            {'Total'}
          </Table.HeaderCell>
          <Table.HeaderCell>
            {'Billable %'}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>,
      <Table.Body
        key="users-body"
      >
        {this._renderRows()}
        <Table.Row>
          <Table.Cell />
          <Table.Cell
            positive
          >
            {this._calcBillable().toFixed(1)}
          </Table.Cell>
          <Table.Cell
            warning
          >
            {this._calcNonBillable().toFixed(1)}
          </Table.Cell>
          <Table.Cell
            collapsing
          >
            {this._calcTotal().toFixed(1)}
          </Table.Cell>
          <Table.Cell>
            {`${(this._calcPercentBillable() * 100).toFixed(2)}%`}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    ];
  }
}

export default UsersTable;
