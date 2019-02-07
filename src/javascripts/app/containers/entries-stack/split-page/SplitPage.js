import * as Yup from 'yup';

import { getEntry, reset, splitEntry } from 'javascripts/app/redux/entry';

import { Formik } from 'formik';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import SplitForm from './SplitForm';
// import _get from 'lodash/get';
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
  }

  static defaultProps = {
    entry: null,
    fetching: null
  }

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

    let initialValues = { entries: [], timezone };
    let hours         = 0;

    if (entry) {
      const startedAt = moment.tz(entry.startedAt, entry.timezone);

      let stoppedAt = null;

      if (entry.stoppedAt) {
        stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
      } else {
        stoppedAt = moment().tz(entry.timezone);
      }

      hours = stoppedAt
        .diff(entry.startedAt, 'hours', true)
        .toFixed(1);

      initialValues = {
        entries: [
          {
            clientRef: entry.clientRef,
            description: entry.description,
            hours,
            percent: '100.0',
            projectRef: entry.projectRef,
            startedAt: startedAt.format('MM/DD/YYYY hh:mm A z'),
            stoppedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
            timezone: entry.timezone
          }, {
            clientRef: null,
            description: '',
            hours: '0.0',
            percent: '0.0',
            projectRef: null,
            startedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
            stoppedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
            timezone: entry.timezone
          }
        ],
        id: entry.id,
        startedAt: startedAt.format('MM/DD/YYYY hh:mm A z'),
        stoppedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z'),
        timezone: entry.timezone
      };
    }

    return { hours, initialValues };
  }

  render() {
    const { entry, fetching, onSplitEntry } = this.props;

    const { initialValues } = this._getInitialValuesAndHours(entry);

    const validationSchema = Yup.object().shape({
      startedAt: Yup.number()
        .parsedTime('Started is not a valid date/time')
        .positive('Started is Required'),
      stoppedAt: Yup.number()
        .parsedTime('Started is not a valid date/time'),
      timezone: Yup.string().required('Timezone is Required')
    });

    return (
      <div className="p-4">
        <h1 className="text-blue">
          {'Split Entry'}
        </h1>
        <div className="border rounded mb-4 p-4">
          <Formik
            component={SplitForm}
            enableReinitialize
            initialValues={initialValues}
            onSubmit={onSplitEntry}
            validationSchema={validationSchema}
          />
          <Spinner
            page
            spinning={Boolean(fetching)}
            text={fetching}
          />
        </div>
      </div>
    );
  }
}

const props = (state) => {
  return {
    entry: state.entry.entry,
    fetching: state.entry.fetching,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onGetEntry: getEntry,
  onReset: reset,
  onSplitEntry: splitEntry
};

export default connect(props, actions)(EntrySplitPage);
