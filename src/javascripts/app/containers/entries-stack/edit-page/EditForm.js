import { getEntry, updateEntry } from 'javascripts/app/redux/entry';

import EntryForm from '../EntryForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import moment from 'moment';

class EntryEditPage extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    running: PropTypes.entry
  }

  static defaultProps = {
    entry: null,
    fetching: null,
    page: false,
    running: null
  }

  componentDidMount() {
    const { match, onGetEntry } = this.props;

    onGetEntry(match.params.id);
  }

  shouldComponentUpdate(nextProps) {
    const { entry, fetching, running } = this.props;

    return (
      fetching !== nextProps.fetching ||
      !_isEqual(entry, nextProps.entry) ||
      !_isEqual(running, nextProps.running)
    );
  }

  _getInitialValuesAndIsRequired() {
    const { entry, running } = this.props;

    let initialValues = {};
    let isRequired    = null;

    if (entry) {
      const startedAt = moment.tz(entry.startedAt, entry.timezone)
        .format('MM/DD/YYYY hh:mm A z');

      let stoppedAt = null;

      if (entry.stoppedAt) {
        stoppedAt = moment.tz(entry.stoppedAt, entry.timezone)
          .format('MM/DD/YYYY hh:mm A z');
      }

      initialValues = {
        clientRef: entry.clientRef,
        description: entry.description,
        projectRef: entry.projectRef,
        startedAt,
        stoppedAt,
        timezone: entry.timezone
      };

      isRequired = running;

      if (running && running.id === entry.id) {
        isRequired = null;
      }
    }

    return { initialValues, isRequired };
  }

  render() {
    const { entry, fetching, onUpdateEntry, page } = this.props;

    const { initialValues, isRequired } = this._getInitialValuesAndIsRequired();

    return (
      <React.Fragment>
        {entry &&
          <EntryForm
            initialValues={initialValues}
            onSaveEntry={onUpdateEntry}
            running={isRequired}
            timezone={entry.timezone}
          />}
        <Spinner
          page={page}
          spinning={Boolean(fetching)}
          text={fetching}
        />
      </React.Fragment>
    );
  }
}

const props = (state) => {
  return {
    entry: state.entry.entry,
    fetching: state.entry.fetching,
    running: state.running.entry
  };
};

const actions = {
  onGetEntry: getEntry,
  onUpdateEntry: updateEntry
};

export default connect(props, actions)(EntryEditPage);
