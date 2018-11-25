import { ActionButton } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import styled from 'styled-components';

const Ellipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

class RecentRow extends React.Component {
  static propTypes = {
    onStartEntry: PropTypes.func.isRequired,
    recent: PropTypes.recent.isRequired,
    user: PropTypes.user.isRequired
  }

  constructor(props) {
    super(props);

    this._handleStart = this._handleStart.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { user, recent } = this.props;

    return (
      !_isEqual(recent, nextProps.recent) ||
      !_isEqual(user, nextProps.user)
    );
  }

  _handleStart() {
    const { onStartEntry, user, recent } = this.props;

    let description = '';

    if (user.autoloadLastDescription) {
      description = _get(recent, 'description', '');
    }

    onStartEntry({
      clientRef: recent.clientRef,
      description,
      projectRef: recent.projectRef
    });
  }

  render() {
    const { recent } = this.props;

    return (
      <div className="border-b border-grey p-4">
        <div className="flex items-center">
          <div className="flex-1 pr-4">
            <Ellipsis>
              <em>
                <small>
                  {recent.client.name}
                </small>
              </em>
            </Ellipsis>
            <Ellipsis>
              {recent.project.name}
            </Ellipsis>
          </div>
          <ActionButton
            onClick={this._handleStart}
            title="Start"
            type="button"
          >
            <FontAwesomeIcon
              icon="play"
            />
          </ActionButton>
        </div>
      </div>
    );
  }
}

export default RecentRow;
