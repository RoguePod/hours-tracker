import ProjectRow from './ProjectRow';
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

const ProjectsDropdown = ({ clients, ...rest }) => {
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

  const dropdownClasses = cx(
    'bg-white border-blue rounded-b absolute pin-x shadow-md z-10 ' +
    'overflow-x-hidden overflow-y-auto',
    {
      'border-b border-l border-r': keys.length > 0
    }
  );

  return (
    <Dropdown
      className={dropdownClasses}
      pose={keys.length > 0 ? 'show' : 'hide'}
    >
      {rows}
    </Dropdown>
  );
};

ProjectsDropdown.propTypes = {
  clients: PropTypes.shape({
    clientName: PropTypes.shape({ name: PropTypes.string })
  }).isRequired
};

export default ProjectsDropdown;
