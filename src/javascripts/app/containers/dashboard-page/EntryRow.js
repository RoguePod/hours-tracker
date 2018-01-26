import { Icon, Popup, Table } from 'semantic-ui-react';

import { ConfirmAction } from 'javascripts/shared/components';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { history } from 'javascripts/app/redux/store';
import moment from 'moment-timezone';
import nl2br from 'react-nl2br';
import styles from './EntryRow.scss';

class EntryRow extends React.Component {
  static propTypes = {
    entry: PropTypes.entry.isRequired,
    onDestroyEntry: PropTypes.func.isRequired,
    timezone: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handleDestroy = this._handleDestroy.bind(this);
    this._handleLink = this._handleLink.bind(this);
  }

  componentDidMount() {
    const { entry: { stoppedAt } } = this.props;

    if (!stoppedAt) {
      this._handleStartInterval();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { entry: { stoppedAt } } = this.props;

    if (!stoppedAt && nextProps.entry.stoppedAt) {
      this._handleStopInterval();
    } else if (stoppedAt && !nextProps.entry.stoppedAt) {
      this._handleStartInterval();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { entry } = this.props;

    return (
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentWillUnmount() {
    this._handleStopInterval();
  }

  interval = null

  _handleStartInterval() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 60 * 6);
  }

  _handleStopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  _handleDestroy() {
    const { entry, onDestroyEntry } = this.props;

    onDestroyEntry(entry.id);
  }

  _handleLink() {
    const { entry } = this.props;

    history.push(`/entries/${entry.id}/edit`);
  }

  render() {
    const { entry, timezone } = this.props;
    const { project } = entry;

    const startedAt = moment.tz(entry.startedAt, entry.timezone);
    let stoppedAt   = null;

    if (entry.stoppedAt) {
      stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
    } else {
      stoppedAt = moment().tz(entry.timezone);
    }

    return (
      <Table.Row
        className={styles.container}
      >
        <Table.Cell
          collapsing
          singleLine
        >
          <Popup
            content="Edit"
            position="top center"
            size="small"
            trigger={
              <Link
                to={`/entries/${entry.id}/edit`}
              >
                <Icon
                  color="green"
                  name="pencil"
                  size="large"
                />
              </Link>
            }
          />
          <Popup
            content="Split"
            position="top center"
            size="small"
            trigger={
              <Link
                to={`/entries/${entry.id}/split`}
              >
                <Icon
                  color="teal"
                  name="exchange"
                  size="large"
                />
              </Link>
            }
          />
          <ConfirmAction
            message="This will remove this entry.  Are you sure?"
            onClick={this._handleDestroy}
          >
            <Icon
              color="red"
              name="remove"
              size="large"
            />
          </ConfirmAction>
        </Table.Cell>
        <Table.Cell
          collapsing
          error={!project}
          onClick={this._handleLink}
          positive={project && project.billable}
          singleLine
          warning={project && !project.billable}
        >
          {_get(entry, 'client.name', 'No Client')}
        </Table.Cell>
        <Table.Cell
          collapsing
          error={!project}
          onClick={this._handleLink}
          positive={project && project.billable}
          singleLine
          warning={project && !project.billable}
        >
          {_get(entry, 'project.name', 'No Project')}
        </Table.Cell>
        <Table.Cell
          collapsing
          onClick={this._handleLink}
          singleLine
          textAlign="center"
        >
          {startedAt.format('ddd, MM/DD')}
        </Table.Cell>
        <Table.Cell
          collapsing
          onClick={this._handleLink}
          singleLine
          textAlign="center"
        >
          {startedAt.format('h:mma ')}
          {entry.timezone !== timezone &&
            <sup>
              {startedAt.format(' z')}
            </sup>}
        </Table.Cell>
        <Table.Cell
          collapsing
          onClick={this._handleLink}
          singleLine
          textAlign="center"
        >
          {entry.stoppedAt && stoppedAt.format('h:mma')}
          {!entry.stoppedAt &&
            <Icon
              loading
              name="spinner"
            />}
          {(entry.stoppedAt && entry.timezone !== timezone) &&
            <sup>
              {startedAt.format(' z')}
            </sup>}
        </Table.Cell>
        <Table.Cell
          collapsing
          onClick={this._handleLink}
          singleLine
          textAlign="center"
        >
          {stoppedAt.diff(startedAt, 'hours', true).toFixed(1)}
        </Table.Cell>
        <Table.Cell
          onClick={this._handleLink}
        >
          {nl2br(entry.description)}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default EntryRow;
