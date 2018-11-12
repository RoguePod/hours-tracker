import {
  selectFilteredRecents,
  subscribeRecents
} from 'javascripts/app/redux/recents';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RecentRow from './RecentRow';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { startEntry } from 'javascripts/app/redux/running';

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

    const listClasses =
      'flex flex-col items-center justify-center flex-1 text-blue';

    return (
      <React.Fragment>
        <div className="bg-blue text-white p-4 font-bold">
          {'Recent Projects'}
        </div>
        {!ready &&
          <div className={listClasses}>
            <FontAwesomeIcon
              icon="clock"
              pulse
              size="3x"
            />
            <div className="pt-2">
              {'Loading Recents...'}
            </div>
          </div>}

        {ready &&
          <div className="overflow-y-auto overflow-x-hidden">
            {rows}
          </div>}
      </React.Fragment>
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
