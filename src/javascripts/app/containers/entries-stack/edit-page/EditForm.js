import * as Yup from 'yup';

import {
  getEntry,
  reset,
  selectEntryForForm,
  updateEntry
} from 'javascripts/app/redux/entry';

import EntryForm from '../EntryForm';
import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

class EntryEditForm extends React.Component {
  static propTypes = {
    entry: PropTypes.entryForm.isRequired,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    running: PropTypes.entry
  }

  static defaultProps = {
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
      !_isEqual(running, nextProps.running) ||
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  render() {
    const { entry, fetching, onUpdateEntry, page, running } = this.props;

    const validationRules = {
      startedAt: Yup.number()
        .parsedTime('Started is not a valid date/time')
        .positive('Started is Required'),
      stoppedAt: Yup.number()
        .parsedTime('Started is not a valid date/time'),
      timezone: Yup.string().required('Timezone is Required')
    };

    if (running && running.id !== entry.id) {
      validationRules.stoppedAt = validationRules.stoppedAt
        .positive('Stopped is Required');
    }

    const validationSchema = Yup.object().shape(validationRules);

    return (
      <>
        <Formik
          component={EntryForm}
          enableReinitialize
          initialValues={entry}
          onSubmit={onUpdateEntry}
          validationSchema={validationSchema}
        />
        <Spinner
          page={page}
          spinning={Boolean(fetching)}
          text={fetching}
        />
      </>
    );
  }
}

const props = (state) => {
  return {
    entry: selectEntryForForm(state),
    fetching: state.entry.fetching,
    running: state.running.entry
  };
};

const actions = {
  onGetEntry: getEntry,
  onReset: reset,
  onUpdateEntry: updateEntry
};

export default connect(props, actions)(EntryEditForm);
