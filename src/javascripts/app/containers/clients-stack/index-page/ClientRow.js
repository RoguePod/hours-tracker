import { ActionButton } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ProjectRow from './ProjectRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';

class ClientRow extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    client: PropTypes.client.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { admin, client } = this.props;

    return (
      admin !== nextProps.admin ||
      !_isEqual(client, nextProps.client)
    );
  }

  render() {
    const { admin, client } = this.props;

    const clientClasses = cx(
      'w-48 bg-blue-lightest p-4 border-r border-l-4 self-stretch',
      {
        'border-green': client.active,
        'border-red': !client.active
      }
    );

    const clientStyles = {
      borderRightColor: '#dae1e7'
    };

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
      'border rounded shadow mb-4 flex overflow-hidden items-center';

    return (
      <div className={containerClasses}>
        <div
          className={clientClasses}
          style={clientStyles}
        >
          <h3 className="mb-2">
            {client.name}
          </h3>
          {admin &&
            <div className="flex items-center">
              <ActionButton
                as={Link}
                className="mr-1"
                color="orange"
                size={8}
                title="Edit Client"
                to={`/clients/${client.id}/edit`}
              >
                <FontAwesomeIcon
                  icon="pencil-alt"
                />
              </ActionButton>
              <ActionButton
                as={Link}
                color="blue"
                size={8}
                title="New Project"
                to={`/clients/${client.id}/projects/new`}
              >
                <FontAwesomeIcon
                  icon="plus"
                />
              </ActionButton>
            </div>}
        </div>
        <div className="flex-1">
          {projects}
        </div>
      </div>
    );
  }
}

export default ClientRow;
