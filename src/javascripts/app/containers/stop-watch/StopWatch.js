import { change, formValueSelector } from 'redux-form';
import {
  selectRunningEntry,
  startEntry,
  stopEntry,
  subscribeEntry,
  updateEntry
} from 'javascripts/app/redux/running';

import { ActionButton } from 'javascripts/shared/components';
import EntryForm from './EntryForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Timer from './Timer';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

class StopWatch extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    fetching: PropTypes.string,
    onFormChange: PropTypes.func.isRequired,
    onStartEntry: PropTypes.func.isRequired,
    onStopEntry: PropTypes.func.isRequired,
    onSubscribeEntry: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    params: PropTypes.entry.isRequired,
    ready: PropTypes.bool.isRequired
  }

  static defaultProps = {
    entry: null,
    fetching: null
  }

  constructor(props) {
    super(props);

    this._handleStart = this._handleStart.bind(this);
    this._handleSwap = this._handleSwap.bind(this);
    this._handleStop = this._handleStop.bind(this);
  }

  componentDidMount() {
    const { onSubscribeEntry } = this.props;

    onSubscribeEntry();
  }

  shouldComponentUpdate(nextProps) {
    const { entry, fetching, ready } = this.props;

    return (
      fetching !== nextProps.fetching ||
      ready !== nextProps.ready ||
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentDidUpdate(prevProps) {
    const { entry, onFormChange, params } = this.props;
    const { entry: { description, projectRef } } = prevProps;

    if (entry.description !== params.description &&
        entry.description !== description) {
      onFormChange('StopWatchEntryForm', 'description', entry.description);
    }

    if (entry.projectRef !== params.projectRef &&
        entry.projectRef !== projectRef) {
      onFormChange('StopWatchEntryForm', 'clientRef', entry.clientRef);
      onFormChange('StopWatchEntryForm', 'projectRef', entry.projectRef);
    }
  }

  _handleStart() {
    const { onStartEntry, params } = this.props;

    onStartEntry(params);
  }

  _handleSwap() {
    const { onStartEntry } = this.props;

    onStartEntry({});
  }

  _handleStop() {
    const { onStopEntry } = this.props;

    onStopEntry();
  }

  /* eslint-disable max-lines-per-function */
  _renderRunningButtons(entry) {
    return (
      <div className="flex">
        <div>
          <Timer {...this.props} />
        </div>

        <div
          className="text-red"
          onClick={this._handleStop}
        >
          <FontAwesomeIcon
            icon="stop"
          />
        </div>

        <div
          className="text-violet"
          onClick={this._handleSwap}
        >
          <FontAwesomeIcon
            icon="refresh"
          />
        </div>

        <Link
          className="text-teal"
          to={`/entries/${entry.id}/split`}
        >
          <FontAwesomeIcon
            icon="exchange"
          />
        </Link>

        <div
          className="text-green"
          to={`/entries/${entry.id}/edit`}
        >
          <FontAwesomeIcon
            icon="pencil"
          />
        </div>
      </div>
    );
  }
  /* eslint-enable max-lines-per-function */

  _renderNotRunningButtons() {
    return (
      <div className="flex justify-center">
        <ActionButton
          onClick={this._handleStart}
          title="Start Timer"
        >
          <FontAwesomeIcon
            icon="play"
          />
        </ActionButton>
      </div>
    );
  }

  render() {
    const { entry, fetching, onUpdateEntry, ready } = this.props;

    return (
      <div className="p-4">
        {!ready &&
          <div>
            {'Loading Stop Watch...'}
          </div>}
        {ready && entry.id && this._renderRunningButtons(entry)}
        {ready && !entry.id && this._renderNotRunningButtons()}
        <div>
          <EntryForm
            initialValues={entry}
            onUpdateEntry={onUpdateEntry}
          />
        </div>
        {fetching &&
          <div>
            <FontAwesomeIcon
              icon="clock"
              pulse
            />
            <div>
              {fetching}
            </div>
          </div>}
      </div>
    );
  }
}

const formSelector = formValueSelector('StopWatchEntryForm');

const props = (state) => {
  return {
    entry: selectRunningEntry(state),
    fetching: state.running.fetching,
    params: formSelector(state, 'projectRef', 'clientRef', 'description'),
    ready: state.running.ready
  };
};

const actions = {
  onFormChange: change,
  onStartEntry: startEntry,
  onStopEntry: stopEntry,
  onSubscribeEntry: subscribeEntry,
  onUpdateEntry: updateEntry
};

export default connect(props, actions)(StopWatch);
