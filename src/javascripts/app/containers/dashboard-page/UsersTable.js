import PropTypes from 'javascripts/prop-types';
import React from 'react';
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
    const dow = moment.tz(date, timezone)
      .add(index, 'd')
      .format('ddd');
    headerCells.push(
      <th
        className="w-px"
        key={dow}
      >
        {dow}
      </th>
    );
  });

  return headerCells;
};

const UsersTable = (props) => {
  const { query: { date }, timezone, users } = props;

  const startMonth = moment.tz(date, timezone);
  const endMonth   = moment.tz(date, timezone).add(6, 'd');

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>
              {'User'}
            </th>
            {_renderHeaderCells(date, timezone)}
            <th className="w-px">
              {'Totals'}
            </th>
            <th className="bg-blue text-white w-px">
              {startMonth.format('MMM')}
            </th>
            {startMonth.format('MMM') !== endMonth.format('MMM') &&
              <th className="bg-blue text-white w-px">
                {endMonth.format('MMM')}
              </th>}
          </tr>
        </thead>
        <tbody>
          {_renderRows(users, startMonth, endMonth, props)}
        </tbody>
        <UsersFooter
          {...props}
          endMonth={endMonth}
          startMonth={startMonth}
        />
      </table>
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
