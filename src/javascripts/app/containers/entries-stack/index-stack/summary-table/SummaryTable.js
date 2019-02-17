import { Button, Table } from "javascripts/shared/components";
import {
  selectClientsByEntries,
  selectQuery,
  selectUsersByEntries,
  subscribeEntries
} from "javascripts/app/redux/entries";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProjectsTable from "./ProjectsTable";
import PropTypes from "javascripts/prop-types";
import React from "react";
import UsersTable from "./UsersTable";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import { isBlank } from "javascripts/globals";
import { selectTimezone } from "javascripts/app/redux/app";

class EntriesSummaryTable extends React.Component {
  static propTypes = {
    clients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    location: PropTypes.routerLocation.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this._checkWarning = this._checkWarning.bind(this);
    this._handleSubscribe = this._handleSubscribe.bind(this);
  }

  state = {
    warning: false
  };

  componentDidMount() {
    this._checkWarning();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      location: { pathname },
      clients,
      query
    } = this.props;
    const { warning } = this.state;

    return (
      warning !== nextState.warning ||
      !_isEqual(query, nextProps.query) ||
      pathname !== nextProps.location.pathname ||
      !_isEqual(clients, nextProps.clients)
    );
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname },
      query
    } = this.props;

    if (
      pathname !== prevProps.location.pathname ||
      !_isEqual(query, prevProps.query)
    ) {
      this._checkWarning();
    }
  }

  _checkWarning() {
    const { onSubscribeEntries, query } = this.props;
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
    }
  }

  _handleSubscribe() {
    const { onSubscribeEntries } = this.props;

    this.setState({ warning: false });
    onSubscribeEntries(null);
  }

  _renderWarning() {
    const text =
      "You've requested to get all entries, without filters, " +
      "which can be slow.";

    return (
      <div className="text-center">
        <FontAwesomeIcon
          className="text-red"
          icon="exclamation-circle"
          size="5x"
        />
        <div className="py-4 text-xl">{text}</div>
        <Button
          className="py-2 px-4 text-lg"
          color="red"
          onClick={this._handleSubscribe}
          type="submit"
        >
          {"Do it Anyway"}
        </Button>
      </div>
    );
  }

  render() {
    const { warning } = this.state;

    if (warning) {
      return this._renderWarning();
    }

    return (
      <Table.Responsive>
        <Table.Table>
          <thead>
            <tr>
              <Table.Th colSpan={5}>{"Summary by Users"}</Table.Th>
            </tr>
          </thead>
          <UsersTable {...this.props} />
          <thead>
            <tr>
              <Table.Th colSpan={5}>{"Summary by Clients/Projects"}</Table.Th>
            </tr>
          </thead>
          <ProjectsTable {...this.props} />
        </Table.Table>
      </Table.Responsive>
    );
  }
}

const props = state => {
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

export default connect(
  props,
  actions
)(EntriesSummaryTable);
