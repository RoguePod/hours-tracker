import ClientRow from './ClientRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
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

  const dropdownClasses = cx(
    'bg-white border-blue rounded-b absolute pin-x shadow-md z-10 ' +
    'overflow-x-hidden overflow-y-auto list-reset',
    {
      'border-b border-l border-r': clients.length > 0
    }
  );

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
