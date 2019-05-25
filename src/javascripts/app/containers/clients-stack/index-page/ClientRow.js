import { ActionIcon, Icon, Tooltip } from 'javascripts/shared/components';

import { Link } from 'react-router-dom';
import ProjectRow from './ProjectRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';

class ClientRow extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    client: PropTypes.client.isRequired,
    location: PropTypes.routerLocation.isRequired
  };

  shouldComponentUpdate(nextProps) {
    const { admin, client } = this.props;

    return admin !== nextProps.admin || !_isEqual(client, nextProps.client);
  }

  render() {
    const { admin, client, location } = this.props;

    const clientClasses = cx(
      'md:w-48 bg-blue-200 p-4 md:border-t-0 md:border-l-4 border-t-4',
      'border-r-0',
      {
        'border-green-500': client.active,
        'border-red-500': !client.active
      }
    );

    const projects = client.projects.map((project, index) => {
      return (
        <ProjectRow
          {...this.props}
          client={client}
          first={index === 0}
          key={project.id}
          project={project}
        />
      );
    });

    const containerClasses =
      'border rounded shadow mb-4 flex overflow-hidden md:flex-row flex-col ' +
      'flex-1';

    return (
      <div className={containerClasses}>
        <div className={clientClasses}>
          <h3 className="mb-2">{client.name}</h3>
          {admin && (
            <div className="flex items-center">
              <Tooltip title={client.active ? 'Active' : 'Inactive'}>
                <Icon
                  className="mr-1"
                  color="transparent"
                  icon="check"
                  size={8}
                  textColor={client.active ? 'green' : 'red'}
                />
              </Tooltip>
              <ActionIcon
                as={Link}
                className="mr-1"
                color="orange"
                icon="pencil-alt"
                size={8}
                title="Edit Client"
                to={{
                  ...location,
                  pathname: `/clients/${client.id}/edit`,
                  state: { modal: true }
                }}
              />
              <ActionIcon
                as={Link}
                color="blue"
                icon="plus"
                size={8}
                title="New Project"
                to={{
                  ...location,
                  pathname: `/clients/${client.id}/projects/new`,
                  state: { modal: true }
                }}
              />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col border-t md:border-t-0">
          {projects}
        </div>
      </div>
    );
  }
}

export default ClientRow;
