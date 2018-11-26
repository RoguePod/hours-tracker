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
import IndexMenu from './IndexMenu';
import IndexTable from './index-table/IndexTable';
import PayrollTable from './payroll-table/PayrollTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SummaryTable from './summary-table/SummaryTable';
import { connect } from 'react-redux';

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

    this._handleRenderReportsPage = this._handleRenderReportsPage.bind(this);
    this._handleRenderIndexPage = this._handleRenderIndexPage.bind(this);
    this._handleRenderSummaryTable = this._handleRenderSummaryTable.bind(this);
    this._handleRenderPayrollTable = this._handleRenderPayrollTable.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  _handleRenderIndexPage() {
    const { location } = this.props;

    return (
      <IndexTable
        location={location}
      />
    );
  }

  _handleRenderReportsPage() {
    const { location } = this.props;

    return (
      <IndexTable
        location={location}
        showAdmin
      />
    );
  }

  _handleRenderSummaryTable() {
    const { location } = this.props;

    return (
      <SummaryTable
        location={location}
      />
    );
  }

  _handleRenderPayrollTable() {
    const { location } = this.props;

    return (
      <PayrollTable
        location={location}
      />
    );
  }

  _renderRoutes() {
    const { admin, match } = this.props;

    return (
      <Switch>
        {admin &&
          <Route
            path={`${match.url}/reports/payroll`}
            render={this._handleRenderPayrollTable}
          />}
        {admin &&
          <Route
            path={`${match.url}/reports/summary`}
            render={this._handleRenderSummaryTable}
          />}
        {admin &&
          <Route
            path={`${match.url}/reports`}
            render={this._handleRenderReportsPage}
          />}
        <Route
          path={`${match.url}/summary`}
          render={this._handleRenderSummaryTable}
        />
        <Route
          exact
          path={match.url}
          render={this._handleRenderIndexPage}
        />
      </Switch>
    );
  }

  render() {
    const { fetching, location, query } = this.props;
    const { pathname } = location;

    const isReports        = pathname === '/entries/reports';
    const isReportsSummary = pathname === '/entries/reports/summary';
    const showAdmin        = isReports || isReportsSummary;

    return (
      <div className="p-4">
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-blue">
            {'Entries'}
          </h1>
          <Button
            as={Link}
            color="green"
            to={{ pathname: '/entries/new', state: { modal: true } }}
          >
            <FontAwesomeIcon
              icon="plus"
            />
            {' '}
            {'New Entry'}
          </Button>
        </div>

        <ul class="list-reset flex">
          <li class="ml-3 -mb-px mr-1">
            <a class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-dark font-semibold" href="#">My Entries</a>
          </li>
          <li class="mr-1">
            <a class="bg-white inline-block py-2 px-4 text-blue hover:text-blue-darker font-semibold" href="#">Reports</a>
          </li>
        </ul>
        <div className="border rounded p-4">
          <EntriesFilterForm
            initialValues={query}
            location={location}
            query={query}
            showAdmin={showAdmin}
          />
        </div>
        <IndexMenu {...this.props} />
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
