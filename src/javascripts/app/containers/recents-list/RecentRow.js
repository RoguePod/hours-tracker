import { Button, Popup } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import styles from './RecentRow.scss';

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

    if (Number(user.autoloadLastDescription) === 1) {
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
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.name}>
            <div className={styles.client}>
              <em>
                <small>
                  {recent.client.name}
                </small>
              </em>
            </div>
            <div className={styles.project}>
              {recent.project.name}
            </div>
          </div>
          <Button.Group>
            <Popup
              content="Start"
              position="top center"
              size="small"
              trigger={
                <Button
                  color="green"
                  icon="play"
                  onClick={this._handleStart}
                />
              }
            />
          </Button.Group>
        </div>
      </div>
    );
  }
}

export default RecentRow;
