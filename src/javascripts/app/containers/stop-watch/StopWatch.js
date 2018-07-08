import {
  Button, Dimmer, Icon, Loader, Popup, Segment
} from 'semantic-ui-react';
import { change, formValueSelector } from 'redux-form';
import {
  selectRunningEntry, startEntry, stopEntry, subscribeEntry, updateEntry
} from 'javascripts/app/redux/running';

import EntryForm from './EntryForm';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Timer from './Timer';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import styles from './StopWatch.scss';

class StopWatch extends React.Component {
  static propTypes = {
    entry: PropTypes.entry,
    fetching: PropTypes.string,
    onFormChange: PropTypes.func.isRequired,
    onStartEntry: PropTypes.func.isRequired,
    onStopEntry: PropTypes.func.isRequired,
    onSubscribeEntry: PropTypes.func.isRequired,
    onUpdateEntry: PropTypes.func.isRequired,
    params: PropTypes.entry.isRequired,
    ready: PropTypes.bool.isRequired
  }

  static defaultProps = {
    entry: null,
    fetching: null
  }

  constructor(props) {
    super(props);

    this._handleStart = this._handleStart.bind(this);
    this._handleSwap = this._handleSwap.bind(this);
    this._handleStop = this._handleStop.bind(this);
  }

  componentDidMount() {
    const { onSubscribeEntry } = this.props;

    onSubscribeEntry();
  }

  shouldComponentUpdate(nextProps) {
    const { entry, fetching, ready } = this.props;

    return (
      fetching !== nextProps.fetching ||
      ready !== nextProps.ready ||
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentDidUpdate(prevProps) {
    const { entry, onFormChange, params } = this.props;
    const { entry: { description, projectRef } } = prevProps;

    if (entry.description !== params.description &&
        entry.description !== description) {
      onFormChange('StopWatchEntryForm', 'description', entry.description);
    }

    if (entry.projectRef !== params.projectRef &&
        entry.projectRef !== projectRef) {
      onFormChange('StopWatchEntryForm', 'clientRef', entry.clientRef);
      onFormChange('StopWatchEntryForm', 'projectRef', entry.projectRef);
    }
  }

  _handleStart() {
    const { onStartEntry, params } = this.props;

    onStartEntry(params);
  }

  _handleSwap() {
    const { onStartEntry } = this.props;

    onStartEntry({});
  }

  _handleStop() {
    const { onStopEntry } = this.props;

    onStopEntry();
  }

  /* eslint-disable max-lines-per-function */
  _renderRunningButtons(entry) {
    return (
      <div>
        <div className={styles.timer}>
          <Timer {...this.props} />
        </div>
        <Button.Group
          fluid
        >
          <Popup
            content="Stop"
            position="top center"
            size="small"
            trigger={
              <Button
                color="red"
                icon="stop"
                onClick={this._handleStop}
              />
            }
          />
          <Popup
            content="Swap"
            position="top center"
            size="small"
            trigger={
              <Button
                color="violet"
                icon="refresh"
                onClick={this._handleSwap}
              />
            }
          />
          <Popup
            content="Split"
            position="top center"
            size="small"
            trigger={
              <Button
                as={Link}
                color="teal"
                icon="exchange"
                to={`/entries/${entry.id}/split`}
              />
            }
          />
          <Popup
            content="Edit"
            position="top center"
            size="small"
            trigger={
              <Button
                as={Link}
                color="green"
                icon="pencil"
                to={`/entries/${entry.id}/edit`}
              />
            }
          />
        </Button.Group>
      </div>
    );
  }
  /* eslint-enable max-lines-per-function */

  _renderNotRunningButtons() {
    return (
      <Button.Group
        fluid
      >
        <Popup
          content="Start"
          position="top center"
          size="small"
          trigger={
            <Button
              color="green"
              icon="play"
              onClick={this._handleStart}
            />
          }
        />
      </Button.Group>
    );
  }

  render() {
    const { entry, fetching, onUpdateEntry, ready } = this.props;

    return (
      <Segment
        basic
        className={styles.container}
      >
        <Dimmer
          active={!ready}
          inverted
        >
          <Loader>
            {'Loading Stop Watch...'}
          </Loader>
        </Dimmer>
        {ready && entry.id && this._renderRunningButtons(entry)}
        {ready && !entry.id && this._renderNotRunningButtons()}
        <div className={styles.form}>
          <EntryForm
            initialValues={entry}
            onUpdateEntry={onUpdateEntry}
          />
        </div>
        {fetching &&
          <div className={styles.flash}>
            <Icon
              loading
              name="spinner"
            />
            <div>
              {fetching}
            </div>
          </div>}
      </Segment>
    );
  }
}

const formSelector = formValueSelector('StopWatchEntryForm');

const props = (state) => {
  return {
    entry: selectRunningEntry(state),
    fetching: state.running.fetching,
    params: formSelector(state, 'projectRef', 'clientRef', 'description'),
    ready: state.running.ready
  };
};

const actions = {
  onFormChange: change,
  onStartEntry: startEntry,
  onStopEntry: stopEntry,
  onSubscribeEntry: subscribeEntry,
  onUpdateEntry: updateEntry
};

export default connect(props, actions)(StopWatch);
