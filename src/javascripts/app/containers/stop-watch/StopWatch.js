import { ActionIcon, Spinner } from "javascripts/shared/components";
import {
  selectRunningEntryForForm,
  startEntry,
  stopEntry,
  updateEntry
} from "javascripts/app/redux/running";

import { Formik } from "formik";
import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import StopWatchForm from "./StopWatchForm";
import Timer from "./Timer";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import _pick from "lodash/pick";
import { connect } from "react-redux";

class StopWatch extends React.Component {
  static propTypes = {
    entry: PropTypes.entry.isRequired,
    fetching: PropTypes.string,
    location: PropTypes.routerLocation.isRequired,
    onStartEntry: PropTypes.func.isRequired,
    onStopEntry: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired
  };

  static defaultProps = {
    fetching: null
  };

  constructor(props) {
    super(props);

    this.form = React.createRef();

    this._handleStart = this._handleStart.bind(this);
    this._handleSwap = this._handleSwap.bind(this);
    this._handleStop = this._handleStop.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._renderForm = this._renderForm.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { entry, fetching, ready } = this.props;

    return (
      fetching !== nextProps.fetching ||
      ready !== nextProps.ready ||
      !_isEqual(entry, nextProps.entry)
    );
  }

  _handleStart() {
    const { onStartEntry } = this.props;

    const params = _get(this.form, "current.state.values", {});

    onStartEntry(
      _pick(params, ["billable", "clientId", "description", "projectId"])
    );
  }

  _handleSwap() {
    const { onStartEntry } = this.props;

    onStartEntry({});
  }

  _handleStop() {
    const { onStopEntry } = this.props;

    onStopEntry();
  }

  _handleSubmit(data) {
    const { entry, onUpdateEntry } = this.props;

    if (entry.id) {
      onUpdateEntry(
        _pick(data, ["billable", "clientId", "description", "projectId"])
      );
    }
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
        <ActionIcon icon="play" onClick={this._handleStart} title="Start" />
      </div>
    );
  }

  _renderForm(formProps) {
    const { entry, ready } = this.props;

    const hasEntry = ready && entry.id;

    return (
      <StopWatchForm
        {...formProps}
        onAutoSave={hasEntry ? this._handleSubmit : null}
      />
    );
  }

  render() {
    const { entry, fetching, ready } = this.props;

    const hasEntry = ready && entry.id;

    const initialValues = _pick(entry, [
      "billable",
      "clientId",
      "description",
      "projectId"
    ]);

    return (
      <div className="relative">
        <div className="p-4">
          <Timer disabled={!hasEntry} entry={entry} />
          {hasEntry && this._renderRunningButtons()}
          {!hasEntry && this._renderNotRunningButtons()}
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={this._handleSubmit}
            ref={this.form}
            render={this._renderForm}
          />
        </div>
        {fetching && <Spinner spinning={Boolean(fetching)} text={fetching} />}
      </div>
    );
  }
}

const props = state => {
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

export default connect(
  props,
  actions
)(StopWatch);
