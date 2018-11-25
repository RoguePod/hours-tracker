import EntryRow from './EntryRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { destroyEntry } from 'javascripts/app/redux/entry';
import { selectTimezone } from 'javascripts/app/redux/app';
import { subscribeEntries } from 'javascripts/app/redux/entries';

class EntriesTable extends React.Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    fetching: PropTypes.string,
    onDestroyEntry: PropTypes.func.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    fetching: null
  }

  componentDidMount() {
    const { onSubscribeEntries } = this.props;

    onSubscribeEntries(this.limit);
  }

  shouldComponentUpdate(nextProps) {
    const { entries, fetching } = this.props;

    return (
      fetching !== nextProps.fetching ||
      !_isEqual(entries, nextProps.entries)
    );
  }

  limit = 10

  _renderRows(entries) {
    return entries.map((entry) => {
      return (
        <EntryRow
          {...this.props}
          entry={entry}
          key={entry.id}
        />
      );
    });
  }

  render() {
    const { entries, fetching } = this.props;

    return (
      <div className="relative min-h-300">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th />
                <th>
                  {'Client'}
                </th>
                <th>
                  {'Project'}
                </th>
                <th>
                  {'Date'}
                </th>
                <th>
                  {'Started'}
                </th>
                <th>
                  {'Stopped'}
                </th>
                <th>
                  {'Hours'}
                </th>
                <th>
                  {'Description'}
                </th>
              </tr>
            </thead>
            <tbody>
              {this._renderRows(entries)}
            </tbody>
          </table>
        </div>
        <Spinner
          spinning={Boolean(fetching)}
          text={fetching}
        />
      </div>
    );
  }
}

const props = (state) => {
  let fetching = null;

  /* eslint-disable prefer-destructuring */
  if (!state.dashboard.fetching) {
    fetching = state.entries.fetching;
  }
  /* eslint-enable prefer-destructuring */

  return {
    entries: state.entries.entries,
    fetching,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onDestroyEntry: destroyEntry,
  onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(EntriesTable);
