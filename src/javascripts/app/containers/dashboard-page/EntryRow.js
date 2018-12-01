import { ActionButton } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import moment from 'moment-timezone';
import nl2br from 'react-nl2br';

class EntryRow extends React.Component {
  static propTypes = {
    entry: PropTypes.entry.isRequired,
    location: PropTypes.routerLocation.isRequired,
    onDestroyEntry: PropTypes.func.isRequired,
    timezone: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handleDestroy = this._handleDestroy.bind(this);
  }

  componentDidMount() {
    const { entry: { stoppedAt } } = this.props;

    if (!stoppedAt) {
      this._handleStartInterval();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { entry } = this.props;

    return (
      !_isEqual(entry, nextProps.entry)
    );
  }

  componentDidUpdate(prevProps) {
    const { entry: { stoppedAt } } = this.props;

    if (!prevProps.entry.stoppedAt && stoppedAt) {
      this._handleStopInterval();
    } else if (prevProps.entry.stoppedAt && !stoppedAt) {
      this._handleStartInterval();
    }
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

  /* eslint-disable max-lines-per-function */
  render() {
    const { entry, location, timezone } = this.props;
    const { project } = entry;

    const startedAt = moment.tz(entry.startedAt, entry.timezone);
    let stoppedAt   = null;

    if (entry.stoppedAt) {
      stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
    } else {
      stoppedAt = moment().tz(entry.timezone);
    }

    const baseHighlightClasses = 'whitespace-no-wrap';

    let highlightClasses = cx(
      'text-green',
      baseHighlightClasses
    );

    if (!project) {
      highlightClasses = cx(
        'text-red',
        baseHighlightClasses
      );
    } else if (!project.billable) {
      highlightClasses = cx(
        baseHighlightClasses
      );
    }

    return (
      <tr className="hover:bg-blue-lightest">
        <td className="whitespace-no-wrap">
          <div className="flex flex-row">
            <ActionButton
              as={Link}
              color="orange"
              size={8}
              title="Edit"
              to={{
                ...location,
                pathname: `/entries/${entry.id}/edit`,
                state: { modal: true }
              }}
            >
              <FontAwesomeIcon
                icon="pencil-alt"
              />
            </ActionButton>
            <ActionButton
              as={Link}
              className="mx-1"
              color="teal"
              size={8}
              title="Split"
              to={`/entries/${entry.id}/split`}
            >
              <FontAwesomeIcon
                icon="exchange-alt"
              />
            </ActionButton>
            <ActionButton
              color="red"
              confirm="This will remove this entry.  Are you sure?"
              onClick={this._handleDestroy}
              size={8}
              title="Remove"
              type="button"
            >
              <FontAwesomeIcon
                icon="times"
              />
            </ActionButton>
          </div>
        </td>
        <td
          className={highlightClasses}
        >
          {_get(entry, 'client.name', 'No Client')}
        </td>
        <td
          className={highlightClasses}
        >
          {_get(entry, 'project.name', 'No Project')}
        </td>
        <td
          className="text-center whitespace-no-wrap"
        >
          {startedAt.format('ddd, MM/DD')}
        </td>
        <td
          className="text-center whitespace-no-wrap"
        >
          {startedAt.format('h:mma ')}
          {entry.timezone !== timezone &&
            <sup>
              {startedAt.format(' z')}
            </sup>}
        </td>
        <td
          className="text-center whitespace-no-wrap"
        >
          {entry.stoppedAt && stoppedAt.format('h:mma')}
          {!entry.stoppedAt &&
            <FontAwesomeIcon
              icon="clock"
              pulse
            />}
          {(entry.stoppedAt && entry.timezone !== timezone) &&
            <sup>
              {startedAt.format(' z')}
            </sup>}
        </td>
        <td
          className="text-center whitespace-no-wrap"
        >
          {stoppedAt.diff(startedAt, 'hours', true).toFixed(1)}
        </td>
        <td>
          {nl2br(entry.description)}
        </td>
      </tr>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default EntryRow;
