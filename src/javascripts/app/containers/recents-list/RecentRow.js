import { ActionIcon } from "javascripts/shared/components";
import { Mutation } from "react-apollo";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import gql from "graphql-tag";
import styled from "styled-components";

const START_MUTATION = gql`
  mutation EntryStart($description: String, $projectId: String) {
    entryStart(description: $description, projectId: $projectId) {
      description
      id
      projectId
    }
  }
`;

const Ellipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

class RecentRow extends React.Component {
  static propTypes = {
    project: PropTypes.project.isRequired,
    user: PropTypes.user.isRequired
  };

  constructor(props) {
    super(props);

    this._handleStart = this._handleStart.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { project } = this.props;

    return !_isEqual(project, nextProps.project);
  }

  _handleStart(onStartEntry) {
    const { project, user } = this.props;

    let description = "";

    if (user.autoloadLastDescription) {
      description = _get(project, "description", "");
    }

    onStartEntry({
      variables: {
        description,
        projectId: project.id
      }
    });
  }

  render() {
    const { project } = this.props;

    return (
      <div className="border-b border-grey p-4">
        <div className="flex items-center">
          <div className="flex-1 pr-4">
            <Ellipsis>
              <em>
                <small>{project.client.name}</small>
              </em>
            </Ellipsis>
            <Ellipsis>{project.name}</Ellipsis>
          </div>
          <Mutation mutation={START_MUTATION}>
            {onStartEntry => (
              <ActionIcon
                icon="play"
                onClick={() => this._handleStart(onStartEntry)}
                title="Start"
                type="button"
              />
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}

export default RecentRow;
