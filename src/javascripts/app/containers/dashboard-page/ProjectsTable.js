import ProjectRow from './ProjectRow';
import ProjectsFooter from './ProjectsFooter';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Table } from 'semantic-ui-react';
import _get from 'lodash/get';
import _times from 'lodash/times';
import moment from 'moment-timezone';
import styles from './ProjectsTable.scss';

const ProjectsTable = (props) => {
  const { projects, query: { date }, timezone } = props;

  const headerCells = [];
  _times(7, (index) => {
    const dow = moment.tz(date, timezone)
      .add(index, 'd')
      .format('ddd');
    headerCells.push(
      <Table.HeaderCell
        collapsing
        key={dow}
      >
        {dow}
      </Table.HeaderCell>
    );
  });

  const startMonth = moment.tz(date, timezone);
  const endMonth   = moment.tz(date, timezone).add(6, 'd');

  const rows = projects.map((value) => {
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

  return (
    <div className={styles.container}>
      <Table
        celled
        selectable
        unstackable
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {'Client'}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {'Project'}
            </Table.HeaderCell>
            {headerCells}
            <Table.HeaderCell
              collapsing
            >
              {'Totals'}
            </Table.HeaderCell>
            <Table.HeaderCell
              className={styles.total}
              collapsing
            >
              {startMonth.format('MMM')}
            </Table.HeaderCell>
            {startMonth.format('MMM') !== endMonth.format('MMM') &&
              <Table.HeaderCell
                className={styles.total}
                collapsing
              >
                {endMonth.format('MMM')}
              </Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows}
        </Table.Body>
        <ProjectsFooter
          {...props}
          endMonth={endMonth}
          startMonth={startMonth}
        />
      </Table>
    </div>
  );
};

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
