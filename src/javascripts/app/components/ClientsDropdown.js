import ClientRow from './ClientRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
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
  top: 100%;
`;

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

  const dropdownClasses =
    'bg-white rounded absolute pin-x shadow-lg z-10 overflow-hidden mt-2 ' +
    'list-reset';

  return (
    <Dropdown
      className={dropdownClasses}
      pose={clients.length > 0 ? 'show' : 'hide'}
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
