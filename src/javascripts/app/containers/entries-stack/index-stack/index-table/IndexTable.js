import { Button, Table } from 'semantic-ui-react';
import {
  checkEntry, selectGroupedEntries, selectQuery, subscribeEntries
} from 'javascripts/app/redux/entries';

import { ConfirmAction } from 'javascripts/shared/components';
import EntryRow from './EntryRow';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { destroyEntry } from 'javascripts/app/redux/entry';
import { selectTimezone } from 'javascripts/app/redux/app';
import styles from './IndexTable.scss';

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

  render() {
    const { checked, entries, showAdmin } = this.props;

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
        <Table.Body
          key={key}
        >
          <Table.Row
            className={styles.dayRow}
            textAlign="center"
          >
            <Table.Cell
              colSpan={showAdmin ? 9 : 8}
            >
              {key}
            </Table.Cell>
          </Table.Row>
          {rows}
        </Table.Body>
      );
    }

    return (
      <div>
        <div>
          <Button
            color="blue"
            content="More"
            floated="right"
            onClick={this._handleMore}
          />
          <ConfirmAction
            message="This will remove all checked entries.  Are you sure?"
            onClick={this._handleDestroy}
          >
            <Button
              color="red"
              content="Remove Checked"
              disabled={checked.length === 0}
              icon="close"
              size="small"
            />
          </ConfirmAction>
        </div>
        <div className={styles.table}>
          <Table
            celled
            unstackable
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  className={styles.headerCell}
                  collapsing
                />
                <Table.HeaderCell
                  className={styles.headerCell}
                  collapsing
                />
                {showAdmin &&
                  <Table.HeaderCell
                    className={styles.headerCell}
                    collapsing
                  >
                    {'User'}
                  </Table.HeaderCell>}
                <Table.HeaderCell
                  className={styles.headerCell}
                  collapsing
                >
                  {'Client'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                  collapsing
                >
                  {'Project'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                  collapsing
                >
                  {'Started'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                  collapsing
                >
                  {'Stopped'}
                </Table.HeaderCell>
                <Table.HeaderCell
                  className={styles.headerCell}
                  collapsing
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
            {tbodies}
          </Table>
        </div>
        <div className={styles.pagination}>
          <Button
            color="blue"
            onClick={this._handleMore}
          >
            {'More'}
          </Button>
        </div>
      </div>
    );
  }
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
