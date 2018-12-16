import {
  selectClientsByEntries,
  selectQuery,
  selectUsersByEntries,
  subscribeEntries
} from 'javascripts/app/redux/entries';

import { Button } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    this._checkWarning();
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname }, query } = this.props;

    if (pathname !== prevProps.location.pathname ||
        !_isEqual(query, prevProps.query)) {
      this._checkWarning();
    }
  }

  _checkWarning() {
    const { location, onSubscribeEntries, query } = this.props;
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
    } else if (!location.hash.match(/filter/u)) {
      history.replace({ ...location, hash: '#filter' });
    }
  }

  _handleSubscribe() {
    const { onSubscribeEntries } = this.props;

    this.setState({ warning: false });
    onSubscribeEntries(null);
  }

  _renderWarning() {
    const text = "You've requested to get all entries, without filters, " +
      'which can be slow.';

    return (
      <div className={styles.warning}>
        <h2 className="text-yellow text-center">
          <FontAwesomeIcon
            icon="exclamation-triangle "
            size="3x"
          />
          {'Caution'}
        </h2>
        <h4>
          {text}
        </h4>
        <div className={styles.button}>
          <Button
            color="yellow"
            onClick={this._handleSubscribe}
          >
            {'Do it Anyway'}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { warning } = this.state;

    if (warning) {
      return this._renderWarning();
    }

    return (
      <div className={styles.container}>
        <table
          celled
          unstackable
        >
          <thead>
            <tr>
              <th colSpan={5}>
                {'Summary by Users'}
              </th>
            </tr>
          </thead>
          <UsersTable {...this.props} />
          <thead>
            <tr>
              <th colSpan={5}>
                {'Summary by Clients/Projects'}
              </th>
            </tr>
          </thead>
          <ProjectsTable {...this.props} />
        </table>
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
