import { ActionIcon, Spinner } from 'javascripts/shared/components';
import {
  selectRunningEntryForForm,
  startEntry,
  stopEntry,
  updateEntry
} from 'javascripts/app/redux/running';

import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import StopWatchForm from './StopWatchForm';
import Timer from './Timer';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import _pick from 'lodash/pick';
import { connect } from 'react-redux';

const StopWatch = (props) => {
  const {
    entry,
    fetching,
    location,
    onStartEntry,
    onStopEntry,
    onUpdateEntry,
    ready
  } = props;
  const hasEntry = Boolean(ready && entry.id);

  const formRef = React.useRef(null);

  const handleStart = () => {
    const params = _get(formRef, 'current.state.values', {});

    onStartEntry(
      _pick(params, ['billable', 'clientId', 'description', 'projectId'])
    );
  };

  const handleSwap = () => {
    onStartEntry({});
  };

  const handleStop = () => {
    onStopEntry();
  };

  const handleSubmit = (data) => {
    if (hasEntry) {
      onUpdateEntry(
        _pick(data, ['billable', 'clientId', 'description', 'projectId'])
      );
    }
  };

  const renderForm = (formProps) => {
    return (
      <StopWatchForm
        {...formProps}
        onAutoSave={hasEntry ? handleSubmit : null}
      />
    );
  };

  const initialValues = _pick(entry, [
    'billable',
    'clientId',
    'description',
    'projectId'
  ]);

  return (
    <div className="relative">
      <div className="p-4">
        <Timer disabled={!hasEntry} entry={entry} />
        {hasEntry && (
          <div className="flex flex-row justify-between flex-no-wrap py-4">
            <ActionIcon
              color="red"
              icon="stop"
              onClick={handleStop}
              title="Stop"
              type="button"
            />

            <ActionIcon
              color="purple"
              icon="sync-alt"
              onClick={handleSwap}
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
        )}
        {!hasEntry && (
          <div className="flex flex-row justify-center flex-no-wrap py-4">
            <ActionIcon icon="play" onClick={handleStart} title="Start" />
          </div>
        )}
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
          ref={formRef}
          render={renderForm}
        />
      </div>
      {fetching && <Spinner spinning={Boolean(fetching)} text={fetching} />}
    </div>
  );
};

StopWatch.propTypes = {
  entry: PropTypes.entry.isRequired,
  fetching: PropTypes.string,
  location: PropTypes.routerLocation.isRequired,
  onStartEntry: PropTypes.func.isRequired,
  onStopEntry: PropTypes.func.isRequired,
  onUpdateEntry: PropTypes.func.isRequired,
  ready: PropTypes.bool.isRequired
};

StopWatch.defaultProps = {
  fetching: null
};

const props = (state) => {
  return {
    entry: selectRunningEntryForForm(state),
    fetching: state.running.fetching,
    ready: state.running.ready
  };
};

const actions = {
  onStartEntry: startEntry,
  onStopEntry: stopEntry,
  onUpdateEntry: updateEntry
};

const areEqual = (prevProps, nextProps) => {
  const { entry, fetching, ready } = prevProps;

  return (
    fetching === nextProps.fetching &&
    ready === nextProps.ready &&
    _isEqual(entry, nextProps.entry)
  );
};

export default connect(
  props,
  actions
)(React.memo(StopWatch, areEqual));
