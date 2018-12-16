import { ActionButton } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import ProjectRow from './ProjectRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';

class ClientBody extends React.Component {
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

  _renderRows(client) {
    return client.projects.map((project) => {
      return (
        <ProjectRow
          {...this.props}
          client={client}
          key={project.id}
          project={project}
        />
      );
    });
  }

  _renderAdminCells(client) {
    return (
      <td className="w-px whitespace-no-wrap">
        <ActionButton
          as={Link}
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
      </td>
    );
  }

  render() {
    const { admin, client } = this.props;

    return (
      <tbody>
        <tr className="bg-grey-dark text-white">
          <td
            colSpan={admin ? 1 : 2}
          >
            {client.name}
          </td>
          <td>
            {client.active ? 'Yes' : 'No'}
          </td>
          {admin && this._renderAdminCells(client)}
        </tr>
        {this._renderRows(client)}
      </tbody>
    );
  }
}

export default ClientBody;
