import { ActionIcon, Clock, Table } from 'javascripts/shared/components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import moment from 'moment-timezone';
import nl2br from 'react-nl2br';
import styled from 'styled-components';

const Checkbox = styled.div`
  outline: none;
`;

class EntryRow extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    entry: PropTypes.entry.isRequired,
    location: PropTypes.routerLocation.isRequired,
    onCheckEntry: PropTypes.func.isRequired,
    onDestroyEntry: PropTypes.func.isRequired,
    showAdmin: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this._handleDestroy = this._handleDestroy.bind(this);
    this._handleChecked = this._handleChecked.bind(this);
  }

  componentDidMount() {
    const {
      entry: { stoppedAt }
    } = this.props;

    if (!stoppedAt) {
      this._handleStartInterval();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { admin, entry } = this.props;

    return admin !== nextProps.admin || !_isEqual(entry, nextProps.entry);
  }

  componentDidUpdate(prevProps) {
    const {
      entry: { stoppedAt }
    } = this.props;

    if (!prevProps.entry.stoppedAt && stoppedAt) {
      this._handleStopInterval();
    } else if (prevProps.entry.stoppedAt && !stoppedAt) {
      this._handleStartInterval();
    }
  }

  componentWillUnmount() {
    this._handleStopInterval();
  }

  interval = null;

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

  render() {
    const { admin, entry, location, showAdmin, timezone } = this.props;
    const { checked, project } = entry;

    const startedAt = moment.tz(entry.startedAt, entry.timezone);
    let stoppedAt = null;

    if (entry.stoppedAt) {
      stoppedAt = moment.tz(entry.stoppedAt, entry.timezone);
    } else {
      stoppedAt = moment().tz(entry.timezone);
    }

    const baseHighlightClasses = 'w-px whitespace-no-wrap';
    let highlightClasses = cx('text-green-500', baseHighlightClasses);

    if (!project) {
      highlightClasses = cx('text-red-500', baseHighlightClasses);
    } else if (!entry.billable) {
      highlightClasses = cx(baseHighlightClasses);
    }

    return (
      <tr className="hover:bg-blue-200">
        <Table.Td className="w-px">
          <Checkbox
            aria-checked={checked}
            className="text-center cursor-pointer text-gray-600"
            onClick={this._handleChecked}
            role="checkbox"
            tabIndex="-1"
          >
            <FontAwesomeIcon
              icon={['far', checked ? 'check-square' : 'square']}
            />
          </Checkbox>
        </Table.Td>
        <Table.Td className="w-px whitespace-no-wrap">
          <div className="flex flex-row">
            <ActionIcon
              as={Link}
              color="orange"
              icon="pencil-alt"
              size={8}
              title="Edit"
              to={{
                ...location,
                pathname: `/entries/${entry.id}/edit`,
                state: { modal: true }
              }}
            />
            <ActionIcon
              as={Link}
              className="mx-1"
              color="teal"
              icon="exchange-alt"
              size={8}
              title="Split"
              to={`/entries/${entry.id}/split`}
            />
            <ActionIcon
              color="red"
              confirm="This will remove this entry.  Are you sure?"
              icon="times"
              onClick={this._handleDestroy}
              size={8}
              title="Remove"
              type="button"
            />
          </div>
        </Table.Td>
        {admin && (
          <Table.Td className="w-px whitespace-no-wrap">
            {entry.user.name}
          </Table.Td>
        )}
        <Table.Td className={highlightClasses}>
          {_get(entry, 'client.name', 'No Client')}
        </Table.Td>
        <Table.Td className={highlightClasses}>
          {_get(entry, 'project.name', 'No Project')}
        </Table.Td>
        <Table.Td className="w-px whitespace-no-wrap text-center">
          {startedAt.format('h:mma')}
          {(showAdmin || entry.timezone !== timezone) && (
            <sup>{startedAt.format(' z')}</sup>
          )}
        </Table.Td>
        <Table.Td className="w-px whitespace-no-wrap text-center">
          {entry.stoppedAt && stoppedAt.format('h:mma')}
          {!entry.stoppedAt && (
            <div className="flex justify-center">
              <Clock size="25px" />
            </div>
          )}
          {entry.stoppedAt && (showAdmin || entry.timezone !== timezone) && (
            <sup>{startedAt.format(' z')}</sup>
          )}
        </Table.Td>
        <Table.Td className="text-center whitespace-no-wrap">
          {stoppedAt.diff(startedAt, 'hours', true).toFixed(1)}
        </Table.Td>
        <Table.Td>{nl2br(entry.description)}</Table.Td>
      </tr>
    );
  }
}

export default EntryRow;
