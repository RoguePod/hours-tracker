import PropTypes from 'javascripts/prop-types';
import React from 'react';
import UserRow from './UserRow';
import cx from 'classnames';
import posed from 'react-pose';
import styled from 'styled-components';

const FadeIn = posed.div({
  hide: {
    height: 0, opacity: 0.5, transition: { duration: 250 }
  },
  show: {
    height: 'auto', opacity: 1, transition: { duration: 250 }
  }
});

const Dropdown = styled(FadeIn)`
  max-height: 300px;
  top: 100%;
`;

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

  const dropdownClasses = cx(
    'bg-white border-blue rounded-b absolute pin-x shadow-md z-10 ' +
    'overflow-x-hidden overflow-y-auto list-reset',
    {
      'border-b border-l border-r': users.length > 0
    }
  );

  return (
    <Dropdown
      className={dropdownClasses}
      pose={users.length > 0 ? 'show' : 'hide'}
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
