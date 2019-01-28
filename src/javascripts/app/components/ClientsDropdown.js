import ClientRow from './ClientRow';
import { Dropdown } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
`;

const ClientsDropdown = ({ clients, ...rest }) => {
  const rows = clients.map((client) => {
    return (
      <React.Fragment
        key={client.id}
      >
        <Divider className="bg-grey-lighter" />
        <ClientRow
          {...rest}
          client={client}
        />
      </React.Fragment>
    );
  });

  return (
    <Dropdown
      open={clients.length > 0}
    >
      {rows}
    </Dropdown>
  );
};

ClientsDropdown.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired
};

export default ClientsDropdown;
