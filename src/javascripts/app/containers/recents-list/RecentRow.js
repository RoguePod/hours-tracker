import { ActionIcon } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

const RecentRow = ({ onStartEntry, user, recent }) => {
  const handleStart = () => {
    let description = '';

    if (user.autoloadLastDescription) {
      description = _get(recent, 'description', '');
    }

    onStartEntry({
      billable: recent.project.billable,
      clientId: recent.clientRef.id,
      description,
      projectId: recent.projectRef.id
    });
  };

  return (
    <div className="border-b p-4">
      <div className="flex items-center">
        <div className="flex-1">
          <em>
            <small>{recent.client.name}</small>
          </em>
          <div>{recent.project.name}</div>
        </div>
        <div className="pl-4">
          <ActionIcon
            icon="play"
            onClick={handleStart}
            title="Start"
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

RecentRow.propTypes = {
  onStartEntry: PropTypes.func.isRequired,
  recent: PropTypes.recent.isRequired,
  user: PropTypes.user.isRequired
};

const areEqual = (prevProps, nextProps) => {
  const { recent } = prevProps;

  return _isEqual(recent, nextProps.recent);
};

export default React.memo(RecentRow, areEqual);
