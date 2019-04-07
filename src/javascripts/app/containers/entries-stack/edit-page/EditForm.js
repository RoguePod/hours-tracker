import * as Yup from "yup";

import {
  getEntry,
  reset,
  selectEntry,
  selectEntryForForm,
  updateEntry
} from "javascripts/app/redux/entry";

import EntryForm from "../EntryForm";
import { Formik } from "formik";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { Spinner } from "javascripts/shared/components";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import { selectAdmin } from "javascripts/app/redux/app";
import { selectEntry as selectRunningEntry } from "javascripts/app/redux/running";

class EntryEditForm extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    entry: PropTypes.entryForm.isRequired,
    fetching: PropTypes.string,
    id: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    running: PropTypes.entry
  };

  static defaultProps = {
    fetching: null,
    id: null,
    page: false,
    running: null
  };

  constructor(props) {
    super(props);

    this._renderForm = this._renderForm.bind(this);
  }

  componentDidMount() {
    const { match, onGetEntry } = this.props;

    onGetEntry(match.params.id);
  }

  shouldComponentUpdate(nextProps) {
    const { entry, fetching, running } = this.props;

    return (
      fetching !== nextProps.fetching ||
      !_isEqual(running, nextProps.running) ||
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  _renderForm(props) {
    const { admin } = this.props;

    return <EntryForm {...props} admin={admin} />;
  }

  render() {
    const { entry, fetching, id, onUpdateEntry, page, running } = this.props;

    const validationRules = {
      startedAt: Yup.number()
        .parsedTime("Started is not a valid date/time")
        .required("Started is Required"),
      stoppedAt: Yup.number()
        .parsedTime("Stopped is not a valid date/time")
        .moreThan(Yup.ref("startedAt"), "Must occur after Started"),
      timezone: Yup.string().required("Timezone is Required")
    };

    if (running && running.id !== id) {
      validationRules.stoppedAt = validationRules.stoppedAt.required(
        "Stopped is Required"
      );
    }

    const validationSchema = Yup.object().shape(validationRules);

    return (
      <>
        <Formik
          initialValues={entry}
          key={id || "empty"}
          onSubmit={onUpdateEntry}
          render={this._renderForm}
          validationSchema={validationSchema}
        />
        <Spinner page={page} spinning={Boolean(fetching)} text={fetching} />
      </>
    );
  }
}

const props = state => {
  return {
    admin: selectAdmin(state),
    entry: selectEntryForForm(state),
    fetching: state.entry.fetching,
    id: _get(selectEntry(state), "id"),
    running: selectRunningEntry(state)
  };
};

const actions = {
  onGetEntry: getEntry,
  onReset: reset,
  onUpdateEntry: updateEntry
};

export default connect(
  props,
  actions
)(EntryEditForm);
