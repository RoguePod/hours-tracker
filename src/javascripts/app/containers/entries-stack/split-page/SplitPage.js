import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import { getEntry, splitEntry } from 'javascripts/app/redux/entry';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitForm from './SplitForm';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import moment from 'moment';
import styles from './SplitPage.scss';

class EntrySplitPage extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onSplitEntry: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
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

  _getInitialValuesAndHours(entry) {
    let initialValues = {};
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
        stoppedAt: stoppedAt.format('MM/DD/YYYY hh:mm A z')
      };
    }

    return { hours, initialValues };
  }

  render() {
    const { entry, fetching, onSplitEntry, values } = this.props;

    const { hours, initialValues } = this._getInitialValuesAndHours(entry);

    return (
      <Segment
        basic
        className={styles.container}
      >
        <Dimmer
          active={Boolean(fetching)}
          inverted
        >
          <Loader>
            {fetching}
          </Loader>
        </Dimmer>
        {entry &&
          <div>
            <Header
              as="h1"
              color="blue"
            >
              {'Edit Entry'}
            </Header>
            <Segment>
              <SplitForm
                currentValues={values}
                hours={Number(hours)}
                initialValues={initialValues}
                onSplitEntry={onSplitEntry}
                timezone={entry.timezone}
              />
            </Segment>
          </div>}
      </Segment>
    );
  }
}

const props = (state) => {
  return {
    entry: state.entry.entry,
    fetching: state.entry.fetching,
    values: _get(state, 'form.EntrySplitForm.values', {})
  };
};

const actions = {
  onGetEntry: getEntry,
  onSplitEntry: splitEntry
};

export default connect(props, actions)(EntrySplitPage);
