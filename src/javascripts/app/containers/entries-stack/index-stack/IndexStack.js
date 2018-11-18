import { Link, Route, Switch } from 'react-router-dom';
import {
  reset,
  selectQuery,
  selectRawQuery
} from 'javascripts/app/redux/entries';
import { selectAdmin, selectTimezone } from 'javascripts/app/redux/app';

import EntriesFilterForm from './EntriesFilterForm';
import EntryNewForm from './EntryNewForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IndexMenu from './IndexMenu';
import IndexTable from './index-table/IndexTable';
import PayrollTable from './payroll-table/PayrollTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import SummaryTable from './summary-table/SummaryTable';
import _get from 'lodash/get';
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
    tab: PropTypes.string.isRequired,
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
    const { location, tab } = this.props;
    const { hash } = location;

    const tabClasses =
      'cursor-pointer py-2 px-4 border-l border-t border-r rounded-t ' +
      'block transition';

    const filterActive =
      (hash === '' && tab === '#filter') || hash === '#filter';
    const filterTabClasses = cx(
      tabClasses,
      {
        'bg-white': filterActive,
        'border-transparent text-blue hover:text-blue-darker': !filterActive
      }
    );

    const newActive = (hash === '' && tab === '#new') || hash === '#new';
    const newTabClasses = cx(
      tabClasses,
      {
        'bg-white': newActive,
        'border-transparent text-blue hover:text-blue-darker': !newActive
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
        <li className="inline-block">
          <Link
            className={newTabClasses}
            replace
            to={{ ...location, hash: '#new' }}
          >
            <FontAwesomeIcon
              icon="plus"
            />
            {' '}
            {'New Entry'}
          </Link>
        </li>
      </ul>
    );
  }

  _renderForm(showAdmin) {
    const { location, query, tab } = this.props;
    const { hash } = location;

    return (
      <div className="border rounded shadow p-4">
        {((hash === '' && tab === '#filter') || hash === '#filter') &&
          <EntriesFilterForm
            initialValues={query}
            location={location}
            query={query}
            showAdmin={showAdmin}
          />}
        {((hash === '' && tab === '#new') || hash === '#new') &&
          <EntryNewForm />}
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
      <div className="px-4">
        <h1 className="text-blue">
          {'Entries'}
        </h1>
        {this._renderTopMenu()}
        {this._renderForm(showAdmin)}
        <IndexMenu {...this.props} />
        {this._renderRoutes()}
        <Spinner
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
    tab: _get(state, 'app.user.entriesTab', '#filter'),
    timezone: selectTimezone(state)
  };
};

const actions = {
  onReset: reset
};

export default connect(props, actions)(EntriesIndexStack);
