import { Dropdown } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import UserRow from './UserRow';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
`;

const UsersDropdown = ({ users, ...rest }) => {
  const rows = users.map((user) => {
    return (
      <React.Fragment
        key={user.id}
      >
        <Divider className="bg-grey-lighter" />
        <UserRow
          {...rest}
          user={user}
        />
      </React.Fragment>
    );
  });

  return (
    <Dropdown
      open={users.length > 0}
    >
      {rows}
    </Dropdown>
  );
};

UsersDropdown.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired
};

export default UsersDropdown;
