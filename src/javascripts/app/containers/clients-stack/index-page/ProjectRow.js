import {
  ActionIcon,
  Icon,
  Tooltip,
  Transition
} from "javascripts/shared/components";

import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _find from "lodash/find";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import cx from "classnames";

class ProjectRow extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    client: PropTypes.client.isRequired,
    first: PropTypes.bool,
    location: PropTypes.routerLocation.isRequired,
    onStartEntry: PropTypes.func.isRequired,
    project: PropTypes.project.isRequired,
    recents: PropTypes.arrayOf(PropTypes.recent).isRequired,
    user: PropTypes.user.isRequired
  };

  static defaultProps = {
    first: false
  };

  constructor(props) {
    super(props);

    this._handleStart = this._handleStart.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { admin, project } = this.props;

    return admin !== nextProps.admin || !_isEqual(project, nextProps.project);
  }

  _handleStart() {
    const { client, onStartEntry, project, recents, user } = this.props;

    const found = _find(recents, recent => recent.id === project.id);

    let description = "";

    if (found && user.autoloadLastDescription) {
      description = _get(found, "description", "");
    }

    onStartEntry({
      billable: project.billable,
      clientId: client.id,
      description,
      projectId: project.id
    });
  }

  render() {
    const { admin, client, first, location, project } = this.props;

    const nameClasses = cx("flex-1", {
      "text-green": project.billable
    });

    const containerClasses = cx(
      "flex p-3 items-center flex-1 hover:bg-blue-lightest md:border-l",
      {
        "border-t": !first
      }
    );

    const active = client.active && project.active;

    return (
      <Transition className={containerClasses}>
        <div className={nameClasses}>{project.name}</div>
        <div className="flex items-center">
          {admin && (
            <>
              <Tooltip title={active ? "Active" : "Inactive"}>
                <Icon
                  className="mr-1"
                  color="transparent"
                  icon="check"
                  size={8}
                  textColor={active ? "green" : "red"}
                />
              </Tooltip>
              <Tooltip title={project.billable ? "Billable" : "Non-Billable"}>
                <Icon
                  className="mr-1"
                  color="transparent"
                  icon="dollar-sign"
                  size={8}
                  textColor={project.billable ? "green" : "red"}
                />
              </Tooltip>
              <ActionIcon
                as={Link}
                className="mr-1"
                color="orange"
                icon="pencil-alt"
                size={8}
                title="Edit Project"
                to={{
                  ...location,
                  pathname: `/clients/${client.id}/projects/${project.id}/edit`,
                  state: { modal: true }
                }}
              />
            </>
          )}
          <ActionIcon
            as="button"
            color="green"
            icon="play"
            onClick={this._handleStart}
            size={8}
            title="Start"
          />
        </div>
      </Transition>
    );
  }
}

export default ProjectRow;
