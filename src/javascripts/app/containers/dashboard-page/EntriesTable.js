import { Spinner, Table } from 'javascripts/shared/components';
import {
  reset,
  selectEntries,
  subscribeEntries
} from 'javascripts/app/redux/entries';

import EntryRow from './EntryRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { destroyEntry } from 'javascripts/app/redux/entry';
import { selectTimezone } from 'javascripts/app/redux/app';

class EntriesTable extends React.Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    fetching: PropTypes.string,
    onDestroyEntry: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    timezone: PropTypes.string.isRequired
  };

  static defaultProps = {
    fetching: null
  };

  componentDidMount() {
    const { onSubscribeEntries } = this.props;

    onSubscribeEntries(this.limit);
  }

  shouldComponentUpdate(nextProps) {
    const { entries, fetching } = this.props;

    return (
      fetching !== nextProps.fetching || !_isEqual(entries, nextProps.entries)
    );
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  limit = 10;

  _renderRows(entries) {
    return entries.map((entry) => {
      return <EntryRow {...this.props} entry={entry} key={entry.id} />;
    });
  }

  render() {
    const { entries, fetching } = this.props;

    return (
      <div className="relative min-h-200">
        <Table.Responsive>
          <Table.Table>
            <thead>
              <tr>
                <Table.Th />
                <Table.Th>{'Client'}</Table.Th>
                <Table.Th>{'Project'}</Table.Th>
                <Table.Th>{'Date'}</Table.Th>
                <Table.Th>{'Started'}</Table.Th>
                <Table.Th>{'Stopped'}</Table.Th>
                <Table.Th>{'Hours'}</Table.Th>
                <Table.Th>{'Description'}</Table.Th>
              </tr>
            </thead>
            <tbody>{this._renderRows(entries)}</tbody>
          </Table.Table>
        </Table.Responsive>
        <Spinner spinning={Boolean(fetching)} text={fetching} />
      </div>
    );
  }
}

const props = (state) => {
  let fetching = null;

  if (!state.dashboard.fetching) {
    fetching = state.entries.fetching;
  }

  return {
    entries: selectEntries(state),
    fetching,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onDestroyEntry: destroyEntry,
  onReset: reset,
  onSubscribeEntries: subscribeEntries
};

export default connect(
  props,
  actions
)(EntriesTable);
