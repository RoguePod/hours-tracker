import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import UserRow from './UserRow';
import UsersFooter from './UsersFooter';
import _times from 'lodash/times';
import moment from 'moment-timezone';
import styles from './UsersTable.scss';

const _renderRows = (users, startMonth, endMonth, props) => {
  return users.map((user) => {
    return (
      <UserRow
        {...props}
        endMonth={endMonth}
        key={user.id}
        startMonth={startMonth}
        user={user}
      />
    );
  });
};

const _renderHeaderCells = (date, timezone) => {
  const headerCells = [];
  _times(7, (index) => {
    const dow = moment.tz(date, timezone)
      .add(index, 'd')
      .format('ddd');
    headerCells.push(
      <Table.HeaderCell
        collapsing
        key={dow}
      >
        {dow}
      </Table.HeaderCell>
    );
  });
};

const UsersTable = (props) => {
  const { query: { date }, timezone, users } = props;

  const startMonth = moment.tz(date, timezone);
  const endMonth   = moment.tz(date, timezone).add(6, 'd');

  return (
    <div className={styles.container}>
      <Table
        celled
        selectable
        unstackable
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {'User'}
            </Table.HeaderCell>
            {_renderHeaderCells(date, timezone)}
            <Table.HeaderCell collapsing>
              {'Totals'}
            </Table.HeaderCell>
            <Table.HeaderCell
              className={styles.total}
              collapsing
            >
              {startMonth.format('MMM')}
            </Table.HeaderCell>
            {startMonth.format('MMM') !== endMonth.format('MMM') &&
              <Table.HeaderCell
                className={styles.total}
                collapsing
              >
                {endMonth.format('MMM')}
              </Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_renderRows(users, startMonth, endMonth, props)}
        </Table.Body>
        <UsersFooter
          {...props}
          endMonth={endMonth}
          startMonth={startMonth}
        />
      </Table>
    </div>
  );
};

UsersTable.propTypes = {
  query: PropTypes.shape({
    date: PropTypes.string.isRequired
  }).isRequired,
  timezone: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(PropTypes.user).isRequired
};

export default UsersTable;
