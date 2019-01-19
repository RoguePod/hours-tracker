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
import chrono from 'chrono-node';
import { connect } from 'react-redux';
import moment from 'moment';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntryEditPage extends React.Component {
  static propTypes = {
    entry: PropTypes.entryForm.isRequired,
    fetching: PropTypes.string,
    isRunning: PropTypes.bool.isRequired,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    page: PropTypes.bool,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    fetching: null,
    page: false
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    const { match, onGetEntry } = this.props;

    onGetEntry(match.params.id);
  }

  shouldComponentUpdate(nextProps) {
    const { entry, fetching, isRunning, timezone } = this.props;

    return (
      fetching !== nextProps.fetching ||
      isRunning !== nextProps.isRunning ||
      timezone !== nextProps.timezone ||
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  _parseDate(value, timezone) {
    const parsed = chrono.parseDate(value);

    if (!parsed) {
      return null;
    }

    const values = [
      parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
      parsed.getHours(), parsed.getMinutes()
    ];

    return moment.tz(values, timezone)
      .utc()
      .valueOf();
  }

  _handleSubmit(data, actions) {
    const { onUpdateEntry } = this.props;

    const params = {
      ...data,
      startedAt: this._parseDate(data.startedAt, data.timezone),
      stoppedAt: this._parseDate(data.stoppedAt, data.timezone)
    };

    onUpdateEntry(params, actions);
  }

  render() {
    const { entry, fetching, page } = this.props;

    const validationSchema = Yup.object().shape({
      startedAt: Yup.string().required('Started is Required'),
      timezone: Yup.string().required('Timezone is Required')
    });

    return (
      <>
        <Formik
          component={EntryForm}
          enableReinitialize
          initialValues={entry}
          onSubmit={this._handleSubmit}
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
    fetching: state.entry.fetching,
    running: state.running.entry,
    timezone: selectTimezone(state),
    ...selectEntryForForm(state)
  };
};

const actions = {
  onGetEntry: getEntry,
  onReset: reset,
  onUpdateEntry: updateEntry
};

export default connect(props, actions)(EntryEditPage);
