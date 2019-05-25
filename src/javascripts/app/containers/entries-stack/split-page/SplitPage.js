import * as Yup from 'yup';

import {
  getEntry,
  reset,
  selectEntry,
  splitEntry
} from 'javascripts/app/redux/entry';

import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import SplitForm from './SplitForm';
import _get from 'lodash/get';
import { calcHours } from 'javascripts/globals';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntrySplitPage extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSplitEntry: PropTypes.func.isRequired,
    timezone: PropTypes.string.isRequired
  };

  static defaultProps = {
    entry: null,
    fetching: null
  };

  componentDidMount() {
    const { match, onGetEntry } = this.props;

    onGetEntry(match.params.id);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  _getInitialValuesAndHours(entry) {
    const { timezone } = this.props;

    if (entry) {
      const stoppedAt = entry.stoppedAt || moment().valueOf();

      return {
        entries: [
          {
            clientId: _get(entry, 'clientRef.id'),
            description: entry.description,
            hours: calcHours(entry.startedAt, entry.stoppedAt, entry.timezone),
            percent: '100.0',
            projectId: _get(entry, 'projectRef.id'),
            startedAt: entry.startedAt,
            stoppedAt,
            timezone: entry.timezone,
            userId: _get(entry, 'userRef.id')
          },
          {
            clientId: null,
            description: '',
            hours: '0.0',
            percent: '0.0',
            projectId: null,
            startedAt: stoppedAt,
            stoppedAt,
            timezone: entry.timezone,
            userId: _get(entry, 'userRef.id')
          }
        ],
        id: entry.id,
        startedAt: entry.startedAt,
        stoppedAt,
        timezone: entry.timezone,
        userId: _get(entry, 'userRef.id')
      };
    }

    return { entries: [], timezone };
  }

  render() {
    const { entry, fetching, onSplitEntry } = this.props;

    const initialValues = this._getInitialValuesAndHours(entry);

    const validationSchema = Yup.object().shape({
      entries: Yup.array().of(
        Yup.object().shape({
          startedAt: Yup.number()
            .parsedTime('Started is not a valid date/time')
            .required('Started is Required'),
          stoppedAt: Yup.number()
            .parsedTime('Stopped is not a valid date/time')
            .required('Stopped is Required')
            .moreThan(Yup.ref('startedAt'), 'Must occur after Started'),
          timezone: Yup.string().required('Timezone is Required')
        })
      ),
      startedAt: Yup.number()
        .parsedTime('Started is not a valid date/time')
        .required('Started is Required'),
      stoppedAt: Yup.number()
        .parsedTime('Stopped is not a valid date/time')
        .required('Stopped is Required')
        .moreThan(Yup.ref('startedAt'), 'Must occur after Started'),
      timezone: Yup.string().required('Timezone is Required')
    });

    return (
      <div className="p-4">
        <h1 className="text-blue-500">{'Split Entry'}</h1>
        <div className="border rounded mb-4 p-4">
          <Formik
            component={SplitForm}
            initialValues={initialValues}
            key={`SplitForm-${_get(entry, 'id')}`}
            onSubmit={onSplitEntry}
            validationSchema={validationSchema}
          />
          <Spinner page spinning={Boolean(fetching)} text={fetching} />
        </div>
      </div>
    );
  }
}

const props = (state) => {
  return {
    entry: selectEntry(state),
    fetching: state.entry.fetching,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onGetEntry: getEntry,
  onReset: reset,
  onSplitEntry: splitEntry
};

export default connect(
  props,
  actions
)(EntrySplitPage);
