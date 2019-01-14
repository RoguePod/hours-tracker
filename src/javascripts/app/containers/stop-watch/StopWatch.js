import { ActionIcon, Spinner } from 'javascripts/shared/components';
import { change, formValueSelector } from 'redux-form';
import {
  selectRunningEntry,
  startEntry,
  stopEntry,
  subscribeEntry,
  updateEntry
} from 'javascripts/app/redux/running';

import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import RunningForm from './RunningForm';
import Timer from './Timer';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

class StopWatch extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    fetching: PropTypes.string,
    location: PropTypes.routerLocation.isRequired,
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
    this._renderForm = this._renderForm.bind(this);
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

  _renderRunningButtons() {
    const { entry, location } = this.props;

    return (
      <div className="flex flex-row justify-between flex-no-wrap py-4">
        <ActionIcon
          color="red"
          icon="stop"
          onClick={this._handleStop}
          title="Stop"
          type="button"
        />

        <ActionIcon
          color="purple"
          icon="sync-alt"
          onClick={this._handleSwap}
          title="Swap"
          type="button"
        />

        <ActionIcon
          as={Link}
          color="teal"
          icon="exchange-alt"
          title="Split"
          to={`/entries/${entry.id}/split`}
        />

        <ActionIcon
          as={Link}
          color="orange"
          icon="pencil-alt"
          title="Edit"
          to={{
            ...location,
            pathname: `/entries/${entry.id}/edit`,
            state: { modal: true }
          }}
        />
      </div>
    );
  }

  _renderNotRunningButtons() {
    return (
      <div className="flex flex-row justify-center flex-no-wrap py-4">
        <ActionIcon
          icon="play"
          onClick={this._handleStart}
          title="Start"
        />
      </div>
    );
  }

  _renderForm(props) {
    const { onUpdateEntry } = this.props;

    return (
      <RunningForm
        {...props}
        onUpdateEntry={onUpdateEntry}
      />
    );
  }

  render() {
    const { entry, fetching, ready } = this.props;

    const hasEntry = ready && entry.id;

    const initialValues = {
      clientRef: _get(entry, 'clientRef', ''),
      description: _get(entry, 'description', ''),
      projectRef: _get(entry, 'projectRef', '')
    };

    return (
      <div className="relative">
        <div className="p-4">
          <Timer
            {...this.props}
            disabled={!hasEntry}
          />
          {hasEntry && this._renderRunningButtons()}
          {!hasEntry && this._renderNotRunningButtons()}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            render={this._renderForm}
          />
        </div>
        {fetching &&
          <Spinner
            spinning={Boolean(fetching)}
            text={fetching}
          />}
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
