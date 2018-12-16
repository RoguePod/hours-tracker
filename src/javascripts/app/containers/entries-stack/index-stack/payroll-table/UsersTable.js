import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Row from './Row';

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

  return (
    <React.Fragment>
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
      </thead>,
      <tbody>
        {rows}
      </tbody>
    </React.Fragment>
  );
};

ProjectsTable.propTypes = {
  users: PropTypes.object.isRequired
};

export default ProjectsTable;
