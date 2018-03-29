import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const AdminMenu = ({ location }) => {
  const { hash } = location;

  return (
    <Menu
      color="blue"
      stackable
    >
      <Menu.Item
        active={hash === ''}
        as={Link}
        icon="dashboard"
        name="My Dashboard"
        replace
        to={{ ...location, hash: '' }}
      />
      <Menu.Item
        active={hash === '#users'}
        as={Link}
        icon="users"
        name="Users"
        replace
        to={{ ...location, hash: '#users' }}
      />
      <Menu.Item
        active={hash === '#projects'}
        as={Link}
        icon="table"
        name="Projects"
        replace
        to={{ ...location, hash: '#projects' }}
      />
    </Menu>
  );
};

AdminMenu.propTypes = {
  location: PropTypes.routerLocation.isRequired
};

export default AdminMenu;
