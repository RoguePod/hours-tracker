import { Button, ConfirmAction } from 'javascripts/shared/components';
import {
  checkEntry,
  selectGroupedEntries,
  selectQuery,
  subscribeEntries
} from 'javascripts/app/redux/entries';

import EntryRow from './EntryRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
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
    onDestroyEntry: PropTypes.func.isRequired,
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
    const { checked, onCheckEntry, onDestroyEntry } = this.props;

    for (const id of checked) {
      onCheckEntry(id);
      onDestroyEntry(id);
    }
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
    const { checked, entries, showAdmin } = this.props;

    return (
      <div>
        <div>
          <Button
            onClick={this._handleMore}
          >
            {'More'}
          </Button>
          <ConfirmAction
            message="This will remove all checked entries.  Are you sure?"
            onClick={this._handleDestroy}
          >
            <Button
              color="red"
              disabled={checked.length === 0}
            >
              <FontAwesomeIcon
                icon="times"
              />
              {' '}
              {'Remove Checked'}
            </Button>
          </ConfirmAction>
        </div>
        <div className="table-responsive">
          <table className="table-hover">
            <thead>
              <tr>
                <th
                  className="w-px"
                  colSpan={2}
                />
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
      </div>
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
  onDestroyEntry: destroyEntry,
  onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(EntriesIndexTable);
