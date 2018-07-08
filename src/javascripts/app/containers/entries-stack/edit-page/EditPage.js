import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import { getEntry, updateEntry } from 'javascripts/app/redux/entry';

import EntryForm from './EntryForm';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import moment from 'moment';
import styles from './EditPage.scss';

class EntryEditPage extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    fetching: PropTypes.string,
    match: PropTypes.routerMatch.isRequired,
    onGetEntry: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    running: PropTypes.entry
  }

  static defaultProps = {
    entry: null,
    fetching: null,
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
      !_isEqual(entry, nextProps.entry) ||
      !_isEqual(running, nextProps.running)
    );
  }

  _getInitialValuesAndIsRequired() {
    const { entry, running } = this.props;

    let initialValues = {};
    let isRequired    = null;

    if (entry) {
      const startedAt = moment.tz(entry.startedAt, entry.timezone)
        .format('MM/DD/YYYY hh:mm A z');

      let stoppedAt = null;

      if (entry.stoppedAt) {
        stoppedAt = moment.tz(entry.stoppedAt, entry.timezone)
          .format('MM/DD/YYYY hh:mm A z');
      }

      initialValues = {
        clientRef: entry.clientRef,
        description: entry.description,
        projectRef: entry.projectRef,
        startedAt,
        stoppedAt,
        timezone: entry.timezone
      };

      isRequired = running;

      if (running && running.id === entry.id) {
        isRequired = null;
      }
    }

    return { initialValues, isRequired };
  }

  render() {
    const { entry, fetching, onUpdateEntry } = this.props;

    const { initialValues, isRequired } = this._getInitialValuesAndIsRequired();

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
              <EntryForm
                initialValues={initialValues}
                onSaveEntry={onUpdateEntry}
                running={isRequired}
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
    running: state.running.entry
  };
};

const actions = {
  onGetEntry: getEntry,
  onUpdateEntry: updateEntry
};

export default connect(props, actions)(EntryEditPage);
