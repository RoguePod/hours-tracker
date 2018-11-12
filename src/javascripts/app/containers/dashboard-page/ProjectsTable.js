import ProjectRow from './ProjectRow';
import ProjectsFooter from './ProjectsFooter';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _times from 'lodash/times';
import moment from 'moment-timezone';

const _renderRows = (projects, startMonth, endMonth, props) => {
  return projects.map((value) => {
    const { client, project } = value;

    return (
      <ProjectRow
        {...props}
        client={client}
        endMonth={endMonth}
        key={_get(project, 'id', 'none')}
        project={project}
        startMonth={startMonth}
      />
    );
  });
};

const _renderHeaderCells = (date, timezone) => {
  const headerCells = [];
  _times(7, (index) => {
    const dow = moment.tz(date, timezone)
      .add(index, 'd')
      .format('ddd');
    headerCells.push(
      <th
        className="w-collapsing"
        key={dow}
      >
        {dow}
      </th>
    );
  });

  return headerCells;
};

/* eslint-disable max-lines-per-function */
const ProjectsTable = (props) => {
  const { projects, query: { date }, timezone } = props;

  const startMonth = moment.tz(date, timezone);
  const endMonth   = moment.tz(date, timezone).add(6, 'd');

  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>
              {'Client'}
            </th>
            <th>
              {'Project'}
            </th>
            {_renderHeaderCells(date, timezone)}
            <th className="w-collapsing">
              {'Totals'}
            </th>
            <th className="bg-blue text-white w-collapsing">
              {startMonth.format('MMM')}
            </th>
            {startMonth.format('MMM') !== endMonth.format('MMM') &&
              <th className="w-collapsing bg-blue text-white">
                {endMonth.format('MMM')}
              </th>}
          </tr>
        </thead>
        <tbody>
          {_renderRows(projects, startMonth, endMonth, props)}
        </tbody>
        <ProjectsFooter
          {...props}
          endMonth={endMonth}
          startMonth={startMonth}
        />
      </table>
    </div>
  );
};
/* eslint-enable max-lines-per-function */

ProjectsTable.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    client: PropTypes.client,
    project: PropTypes.project
  })).isRequired,
  query: PropTypes.shape({
    date: PropTypes.string.isRequired
  }).isRequired,
  timezone: PropTypes.string.isRequired
};

export default ProjectsTable;
