import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Row from './Row';
import { Table } from 'semantic-ui-react';
import styles from './ClientRows.scss';

class ProjectsRow extends React.Component {
  static propTypes = {
    client: PropTypes.client.isRequired
  }

  shouldComponentUpdate() {
    return true;
  }

  _calcBillable() {
    const { client } = this.props;

    let sum = 0.0;

    for (const key of Object.keys(client.projects)) {
      for (const entry of client.projects[key]) {
        if (entry.billable) {
          sum += entry.hours;
        }
      }
    }

    return sum;
  }

  _calcNonBillable() {
    const { client } = this.props;

    let sum = 0.0;

    for (const key of Object.keys(client.projects)) {
      for (const entry of client.projects[key]) {
        if (!entry.billable) {
          sum += entry.hours;
        }
      }
    }

    return sum;
  }

  _calcTotal() {
    const { client } = this.props;

    let sum = 0.0;

    for (const key of Object.keys(client.projects)) {
      for (const entry of client.projects[key]) {
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

  render() {
    const { client } = this.props;

    const rows = Object.keys(client.projects).map((key) => {
      const entries = client.projects[key];

      return (
        <Row
          entries={entries}
          key={key}
          name={key}
        />
      );
    });

    return (
      <Table.Body>
        <Table.Row
          className={styles.clientRow}
        >
          <Table.Cell
            colSpan={5}
          >
            {client.name}
          </Table.Cell>
        </Table.Row>
        {rows}
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
    );
  }
}

export default ProjectsRow;
