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
import { Spinner } from 'javascripts/shared/components';
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

  _renderTopMenu() {
    const { location } = this.props;

    const tabClasses =
      'cursor-pointer py-2 px-4 border-l border-t border-r rounded-t ' +
      'block transition';

    const filterTabClasses = cx(
      tabClasses,
      {
        'bg-white': true,
        'border-transparent text-blue hover:text-blue-darker': !true
      }
    );

    return (
      <ul className="list-reset -mb-px px-4">
        <li className="mr-1 inline-block">
          <Link
            className={filterTabClasses}
            replace
            to={{ ...location, hash: '#filter' }}
          >
            <FontAwesomeIcon
              icon="filter"
            />
            {' '}
            {'Filter'}
          </Link>
        </li>
      </ul>
    );
  }

  _renderForm(showAdmin) {
    const { location, query } = this.props;

    return (
      <div className="border rounded shadow p-4">
        <EntriesFilterForm
          initialValues={query}
          location={location}
          query={query}
          showAdmin={showAdmin}
        />
      </div>
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
    const { fetching, location } = this.props;
    const { pathname } = location;

    const isReports        = pathname === '/entries/reports';
    const isReportsSummary = pathname === '/entries/reports/summary';
    const showAdmin        = isReports || isReportsSummary;

    return (
      <div className="p-4">
        <Link
          to={{ pathname: '/entries/new', state: { modal: true } }}
        >
          {'New Entry'}
        </Link>
        <h1 className="text-blue mb-4">
          {'Entries'}
        </h1>
        {this._renderTopMenu()}
        {this._renderForm(showAdmin)}
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
