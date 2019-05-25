import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'javascripts/shared/components';
import UserRow from './UserRow';
import UsersFooter from './UsersFooter';
import _times from 'lodash/times';
import moment from 'moment-timezone';

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
    const dow = moment
      .tz(date, timezone)
      .add(index, 'd')
      .format('ddd');
    headerCells.push(
      <Table.Th className="w-px" key={dow}>
        {dow}
      </Table.Th>
    );
  });

  return headerCells;
};

const UsersTable = (props) => {
  const {
    query: { date },
    timezone,
    users
  } = props;

  const startMonth = moment.tz(date, timezone);
  const endMonth = moment.tz(date, timezone).add(6, 'd');

  return (
    <Table.Responsive>
      <Table.Table>
        <thead>
          <tr>
            <Table.Th>{'User'}</Table.Th>
            {_renderHeaderCells(date, timezone)}
            <Table.Th className="w-px">{'Totals'}</Table.Th>
            <Table.Th className="bg-blue-500 text-white w-px">
              {startMonth.format('MMM')}
            </Table.Th>
            {startMonth.format('MMM') !== endMonth.format('MMM') && (
              <Table.Th className="bg-blue-500 text-white w-px">
                {endMonth.format('MMM')}
              </Table.Th>
            )}
          </tr>
        </thead>
        <tbody>{_renderRows(users, startMonth, endMonth, props)}</tbody>
        <UsersFooter {...props} endMonth={endMonth} startMonth={startMonth} />
      </Table.Table>
    </Table.Responsive>
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
