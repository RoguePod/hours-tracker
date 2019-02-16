import * as Yup from "yup";

import EntryForm from "../EntryForm";
import { Formik } from "formik";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { Spinner } from "javascripts/shared/components";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import { createEntry } from "javascripts/app/redux/entry";
import { selectTimezone } from "javascripts/app/redux/app";

class EntryNewForm extends React.Component {
  static propTypes = {
    fetching: PropTypes.string,
    onCreateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    running: PropTypes.entry,
    timezone: PropTypes.string.isRequired
  };

  static defaultProps = {
    fetching: null,
    page: false,
    running: null
  };

  shouldComponentUpdate(nextProps) {
    const { fetching, timezone, running } = this.props;

    return (
      fetching !== nextProps.fetching ||
      timezone !== nextProps.timezone ||
      !_isEqual(running, nextProps.running)
    );
  }

  render() {
    const { fetching, onCreateEntry, page, running, timezone } = this.props;

    const validationRules = {
      startedAt: Yup.number()
        .parsedTime("Started is not a valid date/time")
        .required("Started is Required"),
      stoppedAt: Yup.number()
        .parsedTime("Stopped is not a valid date/time")
        .moreThan(Yup.ref("startedAt"), "Must occur after Started"),
      timezone: Yup.string().required("Timezone is Required")
    };

    if (running) {
      validationRules.stoppedAt = validationRules.stoppedAt.required(
        "Stopped is Required"
      );
    }

    const validationSchema = Yup.object().shape(validationRules);

    return (
      <>
        <Formik
          component={EntryForm}
          enableReinitialize
          initialValues={{ timezone }}
          onSubmit={onCreateEntry}
          validationSchema={validationSchema}
        />
        <Spinner page={page} spinning={Boolean(fetching)} text={fetching} />
      </>
    );
  }
}

const props = state => {
  return {
    fetching: state.entry.fetching,
    running: state.running.entry,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onCreateEntry: createEntry
};

export default connect(
  props,
  actions
)(EntryNewForm);
