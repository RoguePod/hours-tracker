import * as Yup from "yup";

import { selectAdmin, selectTimezone } from "javascripts/app/redux/app";

import EntryForm from "../EntryForm";
import { Formik } from "formik";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { Spinner } from "javascripts/shared/components";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import { createEntry } from "javascripts/app/redux/entry";

class EntryNewForm extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    fetching: PropTypes.string,
    onCreateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    running: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired,
    user: PropTypes.user.isRequired
  };

  static defaultProps = {
    fetching: null,
    page: false
  };

  constructor(props) {
    super(props);

    this._renderForm = this._renderForm.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { fetching, timezone, running } = this.props;

    return (
      fetching !== nextProps.fetching ||
      timezone !== nextProps.timezone ||
      !_isEqual(running, nextProps.running)
    );
  }

  _renderForm(props) {
    const { admin } = this.props;

    return <EntryForm {...props} admin={admin} />;
  }

  render() {
    const {
      admin,
      fetching,
      onCreateEntry,
      page,
      running,
      timezone,
      user
    } = this.props;

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

    const initialValues = {
      timezone
    };

    if (admin) {
      initialValues.userId = user.id;
    }

    return (
      <>
        <Formik
          initialValues={initialValues}
          onSubmit={onCreateEntry}
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
    fetching: state.entry.fetching,
    running: Boolean(state.running.entry),
    timezone: selectTimezone(state),
    user: state.app.user
  };
};

const actions = {
  onCreateEntry: createEntry
};

export default connect(
  props,
  actions
)(EntryNewForm);
