import ClientRows from './ClientRows';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';

const ProjectsTable = (props) => {
  const { clients } = props;

  const tbodies = clients.map((client) => {
    return (
      <ClientRows
        client={client}
        key={client.name}
      />
    );
  });

  return [
    <Table.Header
      key="projects-header"
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
    tbodies
  ];
};

ProjectsTable.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  })).isRequired
};

export default ProjectsTable;
