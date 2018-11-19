import { ConfirmAction, Tooltip } from 'javascripts/shared/components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import { history } from 'javascripts/app/redux/store';
import moment from 'moment-timezone';
import nl2br from 'react-nl2br';

class EntryRow extends React.Component {
  static propTypes = {
    entry: PropTypes.entry.isRequired,
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
    const { entry, timezone } = this.props;
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
        'text-blue',
        baseHighlightClasses
      );
    }

    return (
      <tr>
        <td className="whitespace-no-wrap">
          <div className="flex flex-row">
            <Tooltip
              title="Edit"
            >
              <Link
                className="text-orange block"
                to={`/entries/${entry.id}/edit`}
              >
                <FontAwesomeIcon
                  icon="pencil-alt"
                />
              </Link>
            </Tooltip>
            <Tooltip
              title="Split"
            >
              <Link
                className="text-teal block px-2"
                to={`/entries/${entry.id}/split`}
              >
                <FontAwesomeIcon
                  icon="exchange-alt"
                />
              </Link>
            </Tooltip>
            <Tooltip
              title="Remove"
            >
              <ConfirmAction
                message="This will remove this entry.  Are you sure?"
                onClick={this._handleDestroy}
              >
                <FontAwesomeIcon
                  className="text-red"
                  icon="times"
                />
              </ConfirmAction>
            </Tooltip>
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
