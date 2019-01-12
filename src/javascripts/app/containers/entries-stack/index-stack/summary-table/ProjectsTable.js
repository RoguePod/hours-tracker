import ClientRows from './ClientRows';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

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

  return (
    <>
      <thead>
        <tr>
          <th />
          <th>
            {'Billable'}
          </th>
          <th>
            {'Non-Billable'}
          </th>
          <th>
            {'Total'}
          </th>
          <th>
            {'Billable %'}
          </th>
        </tr>
      </thead>
      {tbodies}
    </>
  );
};

ProjectsTable.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  })).isRequired
};

export default ProjectsTable;
