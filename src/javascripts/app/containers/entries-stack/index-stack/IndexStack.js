import { Button, Spinner } from 'javascripts/shared/components';
import { Link, Route, Switch } from 'react-router-dom';
import {
  reset,
  selectQuery,
  selectRawQuery
} from 'javascripts/app/redux/entries';
import { selectAdmin, selectTimezone } from 'javascripts/app/redux/app';

import EntriesFilterForm from './EntriesFilterForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IndexAdminMenu from './IndexAdminMenu';
import IndexMenu from './IndexMenu';
import IndexTable from './index-table/IndexTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SummaryTable from './summary-table/SummaryTable';
import { connect } from 'react-redux';
import cx from 'classnames';

class EntriesIndexStack extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    fetching: PropTypes.string,
    location: PropTypes.routerLocation.isRequired,
    match: PropTypes.routerMatch.isRequired,
    onReset: PropTypes.func.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    rawQuery: PropTypes.entriesQuery.isRequired,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    fetching: null
  }

  constructor(props) {
    super(props);

    this._renderReportsPage = this._renderReportsPage.bind(this);
    this._renderIndexPage = this._renderIndexPage.bind(this);
    this._renderSummaryTable = this._renderSummaryTable.bind(this);
    this._renderTabs = this._renderTabs.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  _renderIndexPage() {
    const { location } = this.props;

    return (
      <IndexTable
        location={location}
      />
    );
  }

  _renderReportsPage() {
    const { location } = this.props;

    return (
      <IndexTable
        location={location}
        showAdmin
      />
    );
  }

  _renderSummaryTable() {
    const { location } = this.props;

    return (
      <SummaryTable
        location={location}
      />
    );
  }

  _renderTabs(showAdmin) {
    const { location } = this.props;

    const baseTabClasses =
      'inline-block text-blue py-2 px-4 border-l border-t border-r rounded-t';

    const selectedTabClasses = cx(
      baseTabClasses, 'bg-white'
    );

    const unselectedTabClasses = cx(
      baseTabClasses,
      'bg-transparent border-transparent hover:text-blue-dark ' +
      'hover:bg-blue-lighter'
    );

    return (
      <ul className="list-reset flex">
        <li className="ml-3 -mb-px mr-1">
          <Link
            className={showAdmin ? unselectedTabClasses : selectedTabClasses}
            to={{ ...location, pathname: '/entries' }}
          >
            {'My Entries'}
          </Link>
        </li>
        <li className="-mb-px">
          <Link
            className={showAdmin ? selectedTabClasses : unselectedTabClasses}
            to={{ ...location, pathname: '/entries/reports' }}
          >
            {'Reports'}
          </Link>
        </li>
      </ul>
    );
  }

  _renderRoutes() {
    const { admin, match } = this.props;

    return (
      <Switch>
        {admin &&
          <Route
            path={`${match.url}/reports/summary`}
            render={this._renderSummaryTable}
          />}
        {admin &&
          <Route
            path={`${match.url}/reports`}
            render={this._renderReportsPage}
          />}
        <Route
          path={`${match.url}/summary`}
          render={this._renderSummaryTable}
        />
        <Route
          exact
          path={match.url}
          render={this._renderIndexPage}
        />
      </Switch>
    );
  }

  render() {
    const { admin, fetching, location, query } = this.props;
    const { pathname } = location;

    const isReports        = pathname === '/entries/reports';
    const isReportsSummary = pathname === '/entries/reports/summary';
    const showAdmin        = admin && (isReports || isReportsSummary);

    return (
      <div className="p-4">
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-blue">
            {'Entries'}
          </h1>
          <Button
            as={Link}
            color="blue"
            to={{
              ...location,
              pathname: '/entries/new',
              state: { modal: true }
            }}
          >
            <FontAwesomeIcon
              icon="plus"
            />
            {' '}
            {'New Entry'}
          </Button>
        </div>
        {admin && this._renderTabs(showAdmin)}
        <div className="border rounded p-4">
          <EntriesFilterForm
            initialValues={query}
            location={location}
            query={query}
            showAdmin={showAdmin}
          />
        </div>
        <div className="my-4">
          {showAdmin && <IndexAdminMenu {...this.props} />}
          {!showAdmin && <IndexMenu {...this.props} />}
        </div>
        {this._renderRoutes()}
        <Spinner
          page
          spinning={Boolean(fetching)}
          text={fetching}
        />
      </div>
    );
  }
}

const props = (state) => {
  return {
    admin: selectAdmin(state),
    fetching: state.entries.fetching,
    query: selectQuery(state),
    rawQuery: selectRawQuery(state),
    timezone: selectTimezone(state)
  };
};

const actions = {
  onReset: reset
};

export default connect(props, actions)(EntriesIndexStack);
