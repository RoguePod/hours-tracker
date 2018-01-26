import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import {
  selectFilteredRecents, subscribeRecents
} from 'javascripts/app/redux/recents';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RecentRow from './RecentRow';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { startEntry } from 'javascripts/app/redux/running';
import styles from './RecentsList.scss';

class RecentsList extends React.Component {
  static propTypes = {
    onSubscribeRecents: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired,
    recents: PropTypes.arrayOf(PropTypes.recent).isRequired,
    user: PropTypes.user.isRequired
  }

  componentDidMount() {
    const { onSubscribeRecents } = this.props;

    onSubscribeRecents();
  }

  shouldComponentUpdate(nextProps) {
    const { ready, recents } = this.props;

    return (
      ready !== nextProps.ready ||
      !_isEqual(recents, nextProps.recents)
    );
  }

  render() {
    const { ready, recents } = this.props;

    const rows = recents.map((recent) => {
      return (
        <RecentRow
          {...this.props}
          key={recent.project.id}
          recent={recent}
        />
      );
    });

    return (
      <Segment
        basic
        className={styles.container}
      >
        <Dimmer
          active={!ready}
          inverted
        >
          <Loader>
            {'Loading Recents...'}
          </Loader>
        </Dimmer>
        <div className={styles.bar}>
          {'Recent Projects'}
        </div>
        {ready &&
          <div className={styles.list}>
            {rows}
          </div>}
      </Segment>
    );
  }
}

const props = (state) => {
  return {
    ready: state.recents.ready,
    recents: selectFilteredRecents(state),
    user: state.app.user
  };
};

const actions = {
  onStartEntry: startEntry,
  onSubscribeRecents: subscribeRecents
};

export default connect(props, actions)(RecentsList);
