import { ActionButton } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';

class ProjectRow extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    client: PropTypes.client.isRequired,
    onStartEntry: PropTypes.func.isRequired,
    project: PropTypes.project.isRequired,
    recents: PropTypes.arrayOf(PropTypes.recent).isRequired,
    user: PropTypes.user.isRequired
  }

  constructor(props) {
    super(props);

    this._handleStart = this._handleStart.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { admin, project } = this.props;

    return (
      admin !== nextProps.admin ||
      !_isEqual(project, nextProps.project)
    );
  }

  _handleStart() {
    const { client, onStartEntry, project, recents, user } = this.props;

    const found = _find(recents, (recent) => recent.id === project.id);

    let description = '';

    if (found && user.autoloadLastDescription) {
      description = _get(found, 'description', '');
    }

    onStartEntry({
      clientRef: client.snapshot.ref,
      description,
      projectRef: project.snapshot.ref
    });
  }

  render() {
    const { admin, client, project } = this.props;

    const nameClasses = cx({
      'text-green': project.billable
    });

    return (
      <tr>
        <td className={nameClasses}>
          {project.name}
        </td>
        <td>
          {project.active ? 'Yes' : 'No'}
        </td>
        <td className="w-px whitespace-no-wrap">
          <ActionButton
            as="button"
            color="green"
            onClick={this._handleStart}
            size={8}
            title="Start"
          >
            <FontAwesomeIcon
              icon="play"
            />
          </ActionButton>
          {admin &&
            <ActionButton
              as={Link}
              color="orange"
              size={8}
              title="Edit Project"
              to={`/clients/${client.id}/projects/${project.id}/edit`}
            >
              <FontAwesomeIcon
                icon="pencil-alt"
              />
            </ActionButton>}
        </td>
      </tr>
    );
  }
}

export default ProjectRow;
