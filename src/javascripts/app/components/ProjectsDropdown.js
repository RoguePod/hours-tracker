import { Dropdown } from 'javascripts/shared/components';
import ProjectRow from './ProjectRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
`;

const ProjectsDropdown = ({ clients, onProjectClick, ...rest }) => {
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
            onProjectClick={onProjectClick}
            project={project}
          />
        </React.Fragment>
      );
    });

    return (
      <React.Fragment
        key={clientId}
      >
        <div className="bg-blue-light p-2 font-bold text-white">
          {result.name}
        </div>
        <ul className="list-reset">
          {projects}
        </ul>
      </React.Fragment>
    );
  });

  return (
    <Dropdown
      {...rest}
      open={keys.length > 0}
    >
      {rows}
    </Dropdown>
  );
};

ProjectsDropdown.propTypes = {
  clients: PropTypes.shape({
    clientName: PropTypes.shape({ name: PropTypes.string })
  }).isRequired,
  onProjectClick: PropTypes.func.isRequired
};

export default ProjectsDropdown;
