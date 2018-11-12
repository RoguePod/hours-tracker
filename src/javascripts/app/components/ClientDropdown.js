import ProjectRow from './ProjectRow';
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

const ClientDropdown = ({ clients, ...rest }) => {
  const keys = Object.keys(clients);

  const rows = keys.map((clientId) => {
    const result = clients[clientId];
    const projects = result.projects.map((project) => {
      return (
        <React.Fragment
          key={project.id}
        >
          <Divider className="bg-grey-lighter" />
          <ProjectRow
            {...rest}
            project={project}
          />
        </React.Fragment>
      );
    });

    return (
      <div
        key={clientId}
      >
        <div className="bg-blue-light p-2 font-bold text-white">
          {result.name}
        </div>
        <ul className="list-reset">
          {projects}
        </ul>
      </div>
    );
  });

  const dropdownClasses =
    'bg-white rounded absolute pin-x shadow-lg z-10 overflow-hidden mt-2';

  return (
    <Dropdown
      className={dropdownClasses}
      pose={keys.length > 0 ? 'show' : 'hide'}
    >
      {rows}
    </Dropdown>
  );
};

ClientDropdown.propTypes = {
  clients: PropTypes.shape({
    clientName: PropTypes.shape({ name: PropTypes.string })
  }).isRequired
};

export default ClientDropdown;
