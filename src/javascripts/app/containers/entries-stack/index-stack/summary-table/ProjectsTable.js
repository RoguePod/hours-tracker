import ClientRows from './ClientRows';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'javascripts/shared/components';

const ProjectsTable = (props) => {
  const { clients } = props;

  const tbodies = clients.map((client) => {
    return <ClientRows client={client} key={client.name} />;
  });

  return (
    <>
      <thead>
        <tr>
          <Table.Td />
          <Table.Td>{'Billable'}</Table.Td>
          <Table.Td>{'Non-Billable'}</Table.Td>
          <Table.Td>{'Total'}</Table.Td>
          <Table.Td>{'Billable %'}</Table.Td>
        </tr>
      </thead>
      {tbodies}
    </>
  );
};

ProjectsTable.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ProjectsTable;
