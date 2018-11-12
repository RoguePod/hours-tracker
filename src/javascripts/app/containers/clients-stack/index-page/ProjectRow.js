import { Button, Popup, Table } from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

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

    return (
      <Table.Row>
        <Table.Cell
          positive={project && project.billable}
          warning={project && !project.billable}
        >
          {project ? project.name : 'No Project'}
        </Table.Cell>
        <Table.Cell>
          {project.active ? 'Yes' : 'No'}
        </Table.Cell>
        <Table.Cell
          collapsing
        >
          <Popup
            content="Start"
            position="top center"
            size="small"
            trigger={
              <Button
                color="green"
                icon="play"
                onClick={this._handleStart}
              />
            }
          />
          {admin &&
            <Popup
              content="Edit Project"
              position="top center"
              size="small"
              trigger={
                <Button
                  as={Link}
                  color="blue"
                  icon="pencil"
                  to={`/clients/${client.id}/projects/${project.id}/edit`}
                />
              }
            />}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ProjectRow;
