import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Row from './Row';
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

  _renderRows(client) {
    return Object.keys(client.projects).map((key) => {
      const entries = client.projects[key];

      return (
        <Row
          entries={entries}
          key={key}
          name={key}
        />
      );
    });
  }

  render() {
    const { client } = this.props;

    return (
      <tbody>
        <tr
          className={styles.clientRow}
        >
          <td
            colSpan={5}
          >
            {client.name}
          </td>
        </tr>
        {this._renderRows(client)}
        <tr>
          <td />
          <td
            positive
          >
            {this._calcBillable().toFixed(1)}
          </td>
          <td
            warning
          >
            {this._calcNonBillable().toFixed(1)}
          </td>
          <td
            collapsing
          >
            {this._calcTotal().toFixed(1)}
          </td>
          <td>
            {`${(this._calcPercentBillable() * 100).toFixed(2)}%`}
          </td>
        </tr>
      </tbody>
    );
  }
}

export default ProjectsRow;
