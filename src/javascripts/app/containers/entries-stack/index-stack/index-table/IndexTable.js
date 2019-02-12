import {
  ActionIcon,
  Button,
  Tooltip
} from 'javascripts/shared/components';
import {
  checkEntry,
  destroyEntries,
  selectGroupedEntries,
  selectQuery,
  setAllChecked,
  subscribeEntries
} from 'javascripts/app/redux/entries';

import EntryRow from './EntryRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _flatten from 'lodash/flatten';
import _isEqual from 'lodash/isEqual';
import _values from 'lodash/values';
import { connect } from 'react-redux';
import { destroyEntry } from 'javascripts/app/redux/entry';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntriesIndexTable extends React.Component {
  static propTypes = {
    checked: PropTypes.arrayOf(PropTypes.string).isRequired,
    /* eslint-disable react/forbid-prop-types */
    entries: PropTypes.object.isRequired,
    /* eslint-enable react/forbid-prop-types */
    location: PropTypes.routerLocation.isRequired,
    onCheckEntry: PropTypes.func.isRequired,
    onDestroyEntries: PropTypes.func.isRequired,
    onDestroyEntry: PropTypes.func.isRequired,
    onSetAllChecked: PropTypes.func.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    showAdmin: PropTypes.bool,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    showAdmin: false
  }

  constructor(props) {
    super(props);

    this._handleMore = this._handleMore.bind(this);
    this._handleDestroy = this._handleDestroy.bind(this);
    this._handleAllChecked = this._handleAllChecked.bind(this);
  }

  componentDidMount() {
    this._handleRefresh();
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname }, query } = this.props;

    if (!_isEqual(query, prevProps.query) ||
        pathname !== prevProps.location.pathname) {
      this._handleRefresh();
    }
  }

  limit = 30

  _handleMore() {
    const { onSubscribeEntries } = this.props;

    this.limit += 30;

    onSubscribeEntries(this.limit);
  }

  _handleRefresh() {
    const { onSubscribeEntries } = this.props;

    this.limit = 30;

    onSubscribeEntries(this.limit);
  }

  _handleDestroy() {
    const { onDestroyEntries } = this.props;

    onDestroyEntries();
  }

  _handleAllChecked() {
    const { onSetAllChecked } = this.props;

    onSetAllChecked();
  }

  _renderTbodies(entries, showAdmin) {
    const tbodies = [];

    for (const key of Object.keys(entries)) {
      const rows = entries[key].map((entry) => {
        return (
          <EntryRow
            {...this.props}
            admin={showAdmin}
            entry={entry}
            key={entry.id}
          />
        );
      });

      tbodies.push(
        <tbody
          key={key}
        >
          <tr
            className="bg-blue-lighter text-center text-blue"
          >
            <td
              colSpan={showAdmin ? 9 : 8}
            >
              {key}
            </td>
          </tr>
          {rows}
        </tbody>
      );
    }

    return tbodies;
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const { checked, entries, location, showAdmin } = this.props;

    const message =
      'This will remove all checked entries, and cannot be undone. ' +
      'Are you sure?';

    const allEntries = _flatten(_values(entries));

    const allChecked = checked.length === allEntries.length;

    return (
      <>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th
                  className="w-px cursor-pointer"
                >
                  <Tooltip
                    title="Check ALL Entries"
                  >
                    <div

                      className="cursor-pointer"
                      onClick={this._handleAllChecked}
                    >
                      <FontAwesomeIcon
                        icon={['far', allChecked ? 'check-square' : 'square']}
                      />
                    </div>
                  </Tooltip>
                </th>
                <th className="w-px whitespace-no-wrap">
                  <div className="flex flex-row">
                    <ActionIcon
                      as={Link}
                      className="mr-1"
                      color="orange"
                      disabled={checked.length === 0}
                      icon="pencil-alt"
                      size={8}
                      title="Edit Checked"
                      to={{
                        ...location,
                        pathname: '/entries/edit',
                        state: { modal: true }
                      }}
                    />
                    <ActionIcon
                      color="red"
                      confirm={message}
                      disabled={checked.length === 0}
                      icon="times"
                      onClick={this._handleDestroy}
                      size={8}
                      title="Remove Checked"
                      type="button"
                    />
                  </div>
                </th>
                {showAdmin &&
                  <th className="w-px">
                    {'User'}
                  </th>}
                <th className="w-px">
                  {'Client'}
                </th>
                <th className="w-px">
                  {'Project'}
                </th>
                <th className="w-px">
                  {'Started'}
                </th>
                <th className="w-px">
                  {'Stopped'}
                </th>
                <th className="w-px">
                  {'Hours'}
                </th>
                <th>
                  {'Description'}
                </th>
              </tr>
            </thead>
            {this._renderTbodies(entries, showAdmin)}
          </table>
        </div>
        <div className="pt-4 text-center">
          <Button
            onClick={this._handleMore}
          >
            {'More'}
          </Button>
        </div>
      </>
    );
  }
  /* eslint-enable max-lines-per-function */
}

const props = (state) => {
  return {
    checked: state.entries.checked,
    entries: selectGroupedEntries(state),
    query: selectQuery(state),
    timezone: selectTimezone(state)
  };
};

const actions = {
  onCheckEntry: checkEntry,
  onDestroyEntries: destroyEntries,
  onDestroyEntry: destroyEntry,
  onSetAllChecked: setAllChecked,
  onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(EntriesIndexTable);
