import ProjectRow from "./ProjectRow";
import ProjectsFooter from "./ProjectsFooter";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { Table } from "javascripts/shared/components";
import _get from "lodash/get";
import _times from "lodash/times";
import moment from "moment-timezone";

const _renderRows = (projects, startMonth, endMonth, props) => {
  return projects.map(value => {
    const { client, project } = value;

    return (
      <ProjectRow
        {...props}
        client={client}
        endMonth={endMonth}
        key={_get(project, "id", "none")}
        project={project}
        startMonth={startMonth}
      />
    );
  });
};

const _renderHeaderCells = (date, timezone) => {
  const headerCells = [];
  _times(7, index => {
    const dow = moment
      .tz(date, timezone)
      .add(index, "d")
      .format("ddd");
    headerCells.push(
      <Table.Th className="w-px" key={dow}>
        {dow}
      </Table.Th>
    );
  });

  return headerCells;
};

const ProjectsTable = props => {
  const {
    projects,
    query: { date },
    timezone
  } = props;

  const startMonth = moment.tz(date, timezone);
  const endMonth = moment.tz(date, timezone).add(6, "d");

  return (
    <Table.Responsive>
      <Table.Table>
        <thead>
          <tr>
            <Table.Th>{"Client"}</Table.Th>
            <Table.Th>{"Project"}</Table.Th>
            {_renderHeaderCells(date, timezone)}
            <Table.Th className="w-px">{"Totals"}</Table.Th>
            <Table.Th className="bg-blue text-white w-px">
              {startMonth.format("MMM")}
            </Table.Th>
            {startMonth.format("MMM") !== endMonth.format("MMM") && (
              <Table.Th className="w-px bg-blue text-white">
                {endMonth.format("MMM")}
              </Table.Th>
            )}
          </tr>
        </thead>
        <tbody>{_renderRows(projects, startMonth, endMonth, props)}</tbody>
        <ProjectsFooter
          {...props}
          endMonth={endMonth}
          startMonth={startMonth}
        />
      </Table.Table>
    </Table.Responsive>
  );
};

ProjectsTable.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.client,
      project: PropTypes.project
    })
  ).isRequired,
  query: PropTypes.shape({
    date: PropTypes.string.isRequired
  }).isRequired,
  timezone: PropTypes.string.isRequired
};

export default ProjectsTable;
