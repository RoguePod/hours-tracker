import { Button, Header, Icon, Table } from 'semantic-ui-react';
import {
  selectClientsByEntries, selectQuery, selectUsersByEntries, subscribeEntries
} from 'javascripts/app/redux/entries';

import ProjectsTable from './ProjectsTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import UsersTable from './UsersTable';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { history } from 'javascripts/app/redux/store';
import { isBlank } from 'javascripts/globals';
import { selectTimezone } from 'javascripts/app/redux/app';
import styles from './SummaryTable.scss';

class EntriesSummaryTable extends React.Component {
  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired
    })).isRequired,
    location: PropTypes.routerLocation.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._checkWarning = this._checkWarning.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
  }

  state = {
    warning: false
  }

  componentDidMount() {
    const { location, query } = this.props;

    this._checkWarning(query, location);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname }, query } = this.props;

    if (pathname !== nextProps.location.pathname ||
        !_isEqual(query, nextProps.query)) {
      this._checkWarning(nextProps.query, nextProps.location);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  _checkWarning(query, location) {
    const { onSubscribeEntries } = this.props;
    let warning = true;

    for (const value of Object.values(query)) {
      if (!isBlank(value)) {
        warning = false;
        break;
      }
    }

    this.setState({ warning });

    if (!warning) {
      onSubscribeEntries(null);
    } else if (!location.hash.match(/filter/)) {
      history.replace({ ...location, hash: '#filter' });
    }
  }

  _handleSubscribe() {
    const { onSubscribeEntries } = this.props;

    this.setState({ warning: false });
    onSubscribeEntries(null);
  }

  render() {
    const { warning } = this.state;

    const text = "You've requested to get all entries, without filters, " +
      'which can be slow.';

    if (warning) {
      return (
        <div className={styles.warning}>
          <Header
            as="h2"
            color="yellow"
            icon
            textAlign="center"
          >
            <Icon
              name="warning sign"
            />
            {'Caution'}
            <Header.Subheader>
              {text}
            </Header.Subheader>
          </Header>
          <div className={styles.button}>
            <Button
              color="yellow"
              content="Do it Anyway"
              onClick={this._handleSubscribe}
              size="huge"
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <Table
          celled
          unstackable
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                colSpan={5}
              >
                {'Summary by Users'}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <UsersTable
            {...this.props}
          />
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                colSpan={5}
              >
                {'Summary by Clients/Projects'}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <ProjectsTable
            {...this.props}
          />
        </Table>
      </div>
    );
  }
}

const props = (state) => {
  return {
    clients: selectClientsByEntries(state),
    query: selectQuery(state),
    timezone: selectTimezone(state),
    users: selectUsersByEntries(state)
  };
};

const actions = {
  onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(EntriesSummaryTable);
