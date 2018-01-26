import { Dimmer, Loader, Segment, Table } from 'semantic-ui-react';

import EntryRow from './EntryRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { destroyEntry } from 'javascripts/app/redux/entry';
import { selectTimezone } from 'javascripts/app/redux/app';
import styles from './EntriesTable.scss';
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

  render() {
    const { entries, fetching } = this.props;

    const rows = entries.map((entry) => {
      return (
        <EntryRow
          {...this.props}
          entry={entry}
          key={entry.id}
        />
      );
    });

    return (
      <Segment
        basic
        className={styles.container}
      >
        <Dimmer
          active={Boolean(fetching)}
          inverted
        >
          <Loader>
            {fetching}
          </Loader>
        </Dimmer>
        <div className={styles.table}>
          <Table
            celled
            unstackable
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  className={styles.headerCell}
                />
                <Table.HeaderCell
                  className={styles.headerCell}
                >
                  {'Client'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                >
                  {'Project'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                >
                  {'Date'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                >
                  {'Started'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                >
                  {'Stopped'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                >
                  {'Hours'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                >
                  {'Description'}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows}
            </Table.Body>
          </Table>
        </div>
      </Segment>
    );
  }
}

const props = (state) => {
  return {
    entries: state.entries.entries,
    fetching: state.entries.fetching,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onDestroyEntry: destroyEntry,
  onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(EntriesTable);
