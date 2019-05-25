import { ActionIcon } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';

class RecentRow extends React.Component {
  static propTypes = {
    onStartEntry: PropTypes.func.isRequired,
    recent: PropTypes.recent.isRequired,
    user: PropTypes.user.isRequired
  };

  constructor(props) {
    super(props);

    this._handleStart = this._handleStart.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { user, recent } = this.props;

    return (
      !_isEqual(recent, nextProps.recent) || !_isEqual(user, nextProps.user)
    );
  }

  _handleStart() {
    const { onStartEntry, user, recent } = this.props;

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
  }

  render() {
    const { recent } = this.props;

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
              onClick={this._handleStart}
              title="Start"
              type="button"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RecentRow;
