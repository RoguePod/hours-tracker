import { ActionIcon } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const START_MUTATION = gql`
  mutation EntryStart($description: String, $projectId: String) {
    entryStart(description: $description, projectId: $projectId) {
      description
      id
      projectId
    }
  }
`;

const RecentRow = ({ project }) => {
  const [onStartEntry] = useMutation(START_MUTATION);

  const _handleStart = () => {
    onStartEntry({
      variables: {
        projectId: project.id
      }
    });
  };

  return (
    <div className="border-b border-grey p-4">
      <div className="flex items-center">
        <div className="flex-1 pr-4">
          <div className="truncate w-full">
            <em>
              <small>{project.client.name}</small>
            </em>
          </div>
          <div className="truncate w-full">{project.name}</div>
        </div>
        <ActionIcon
          icon="play"
          onClick={_handleStart}
          title="Start"
          type="button"
        />
      </div>
    </div>
  );
};

RecentRow.propTypes = {
  project: PropTypes.project.isRequired
};

export default React.memo(RecentRow);
