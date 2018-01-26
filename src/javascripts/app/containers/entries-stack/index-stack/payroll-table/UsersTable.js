import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Row from './Row';
import { Table } from 'semantic-ui-react';

const ProjectsTable = ({ users }) => {
  const rows = Object.keys(users).map((key) => {
    return (
      <Row
        entries={users[key]}
        key={key}
        name={key}
      />
    );
  });

  return [
    <Table.Header
      key="users-header"
    >
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell>
          {'Billable'}
        </Table.HeaderCell>
        <Table.HeaderCell>
          {'Non-Billable'}
        </Table.HeaderCell>
        <Table.HeaderCell>
          {'Total'}
        </Table.HeaderCell>
        <Table.HeaderCell>
          {'Billable %'}
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>,
    <Table.Body
      key="users-body"
    >
      {rows}
    </Table.Body>
  ];
};

ProjectsTable.propTypes = {
  users: PropTypes.object.isRequired
};

export default ProjectsTable;
