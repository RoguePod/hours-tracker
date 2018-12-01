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
    admin: PropTypes.bool.isRequired,
    entry: PropTypes.entry.isRequired,
    location: PropTypes.routerLocation.isRequired,
    onCheckEntry: PropTypes.func.isRequired,
    onDestroyEntry: PropTypes.func.isRequired,
    showAdmin: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handleDestroy = this._handleDestroy.bind(this);
    this._handleChecked = this._handleChecked.bind(this);
  }

  componentDidMount() {
    const { entry: { stoppedAt } } = this.props;

    if (!stoppedAt) {
      this._handleStartInterval();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { admin, entry } = this.props;

    return (
      admin !== nextProps.admin ||
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

  _handleChecked() {
    const { entry, onCheckEntry } = this.props;

    onCheckEntry(entry.id);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const { admin, entry, location, showAdmin, timezone } = this.props;
    const { project } = entry;

    const startedAt = moment.tz(entry.startedAt, entry.timezone);
    let stoppedAt   = null;

    if (entry.stoppedAt) {
      stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
    } else {
      stoppedAt = moment().tz(entry.timezone);
    }

    const baseHighlightClasses = 'w-px whitespace-no-wrap';
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
        <td
          className="w-px text-center cursor-pointer text-grey-darker"
          onClick={this._handleChecked}
        >
          {!entry.checked &&
            <FontAwesomeIcon
              icon={['far', 'square']}
            />}
          {entry.checked &&
            <FontAwesomeIcon
              icon={['far', 'check-square']}
            />}
        </td>
        <td className="w-px whitespace-no-wrap">
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
        {admin &&
          <td
            className="w-px whitespace-no-wrap"
          >
            {entry.user.name}
          </td>}
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
          className="w-px whitespace-no-wrap text-center"
        >
          {startedAt.format('h:mma')}
          {(showAdmin || entry.timezone !== timezone) &&
            <sup>
              {startedAt.format(' z')}
            </sup>}
        </td>
        <td
          className="w-px whitespace-no-wrap text-center"
        >
          {entry.stoppedAt && stoppedAt.format('h:mma')}
          {!entry.stoppedAt &&
            <FontAwesomeIcon
              icon="clock"
              pulse
            />}
          {(entry.stoppedAt && (showAdmin || entry.timezone !== timezone)) &&
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
