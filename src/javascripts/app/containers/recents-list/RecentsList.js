import {
  selectFilteredRecents,
  subscribeRecents
} from 'javascripts/app/redux/recents';

import { Clock } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RecentRow from './RecentRow';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { startEntry } from 'javascripts/app/redux/running';

const RecentsList = (props) => {
  const { onStartEntry, onSubscribeRecents, ready, recents, user } = props;

  React.useEffect(() => {
    onSubscribeRecents();
  }, []);

  const rows = recents.map((recent) => {
    return (
      <RecentRow
        key={recent.project.id}
        onStartEntry={onStartEntry}
        recent={recent}
        user={user}
      />
    );
  });

  const listClasses =
    'flex flex-col items-center justify-center flex-1 text-blue-500';

  return (
    <>
      <div className="bg-blue-500 text-white p-4 font-bold">
        {'Recent Projects'}
      </div>
      {!ready && (
        <div className={listClasses}>
          <Clock size="60px" />
          <div className="pt-2">{'Loading Recents...'}</div>
        </div>
      )}

      {ready && <div className="overflow-y-auto overflow-x-hidden">{rows}</div>}
    </>
  );
};

RecentsList.propTypes = {
  onStartEntry: PropTypes.func.isRequired,
  onSubscribeRecents: PropTypes.func.isRequired,
  ready: PropTypes.bool.isRequired,
  recents: PropTypes.arrayOf(PropTypes.recent).isRequired,
  user: PropTypes.user.isRequired
};

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

const areEqual = (prevProps, nextProps) => {
  const { ready, recents } = prevProps;

  return ready === nextProps.ready && _isEqual(recents, nextProps.recents);
};

export default connect(
  props,
  actions
)(React.memo(RecentsList, areEqual));
