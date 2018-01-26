import { Button, Popup, Table } from 'semantic-ui-react';

import { Link } from 'react-router-dom';
import ProjectRow from './ProjectRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import styles from './ClientBody.scss';

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

  render() {
    const { admin, client } = this.props;

    const rows = client.projects.map((project) => {
      return (
        <ProjectRow
          {...this.props}
          client={client}
          key={project.id}
          project={project}
        />
      );
    });

    return (
      <Table.Body
        key={`body-${client.id}`}
      >
        <Table.Row
          className={styles.row}
        >
          <Table.Cell
            colSpan={admin ? 1 : 2}
          >
            {client.name}
          </Table.Cell>
          <Table.Cell>
            {client.active ? 'Yes' : 'No'}
          </Table.Cell>
          {admin &&
            <Table.Cell
              collapsing
            >
              <Popup
                content="New Project"
                position="top center"
                size="small"
                trigger={
                  <Button
                    as={Link}
                    color="blue"
                    icon="plus"
                    to={`/clients/${client.id}/projects/new`}
                  />
                }
              />
              <Popup
                content="Edit Client"
                position="top center"
                size="small"
                trigger={
                  <Button
                    as={Link}
                    color="blue"
                    icon="edit"
                    to={`/clients/${client.id}/edit`}
                  />
                }
              />
            </Table.Cell>}
        </Table.Row>
        {rows}
      </Table.Body>
    );
  }
}

export default ClientBody;
