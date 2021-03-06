import { Button, Spinner } from 'javascripts/shared/components';
import { Link, Route, Switch } from 'react-router-dom';
import { reset, selectQuery, setLocation } from 'javascripts/app/redux/entries';
import { selectAdmin, selectTimezone } from 'javascripts/app/redux/app';

import EntriesFilterForm from './EntriesFilterForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import IndexAdminMenu from './IndexAdminMenu';
import IndexMenu from './IndexMenu';
import IndexTable from './index-table/IndexTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SummaryTable from './summary-table/SummaryTable';
import _compact from 'lodash/compact';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import cx from 'classnames';
import { history } from 'javascripts/app/redux/store';
import { toQuery } from 'javascripts/globals';

class EntriesIndexStack extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    fetching: PropTypes.string,
    location: PropTypes.routerLocation.isRequired,
    match: PropTypes.routerMatch.isRequired,
    onReset: PropTypes.func.isRequired,
    onSetLocation: PropTypes.func.isRequired,
    query: PropTypes.entriesQuery.isRequired,
    savedLocation: PropTypes.routerLocation,
    timezone: PropTypes.string.isRequired
  };

  static defaultProps = {
    fetching: null,
    savedLocation: null
  };

  constructor(props) {
    super(props);

    this._renderReportsPage = this._renderReportsPage.bind(this);
    this._renderIndexPage = this._renderIndexPage.bind(this);
    this._renderSummaryTable = this._renderSummaryTable.bind(this);
    this._renderTabs = this._renderTabs.bind(this);
    this._renderForm = this._renderForm.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleClear = this._handleClear.bind(this);
  }

  componentDidMount() {
    const { location, onSetLocation, savedLocation } = this.props;

    if (savedLocation) {
      history.replace(savedLocation);
    } else {
      onSetLocation(location);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { location, onSetLocation } = this.props;

    if (!_isEqual(prevProps.location, location)) {
      onSetLocation(location);
    }
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();
  }

  _handleSubmit(data, actions) {
    const { location, query } = this.props;

    const values = _compact(Object.values(data));

    if (values.length > 0) {
      const route = {
        ...location,
        search: `?${toQuery({ ...query, ...data })}`
      };

      history.replace(route);
    } else {
      this._handleClear();
    }

    actions.setSubmitting(false);
  }

  _handleClear() {
    const {
      location: { search, ...rest }
    } = this.props;

    history.replace(rest);
  }

  _renderIndexPage() {
    const { location } = this.props;

    return <IndexTable location={location} />;
  }

  _renderReportsPage() {
    const { location } = this.props;

    return <IndexTable location={location} showAdmin />;
  }

  _renderSummaryTable() {
    const { location } = this.props;

    return <SummaryTable location={location} />;
  }

  _renderTabs(showAdmin) {
    const { location } = this.props;

    const baseTabClasses =
      'inline-block text-blue-500 py-2 px-4 border-l border-t border-r ' +
      'rounded-t';

    const selectedTabClasses = cx(baseTabClasses, 'bg-white');

    const unselectedTabClasses = cx(
      baseTabClasses,
      'bg-transparent border-transparent hover:text-blue-600 ' +
        'hover:bg-blue-300'
    );

    return (
      <ul className="flex">
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

  _renderForm(props) {
    const { admin, location, query } = this.props;
    const { pathname } = location;

    const isReports = pathname === '/entries/reports';
    const isReportsSummary = pathname === '/entries/reports/summary';
    const showAdmin = admin && (isReports || isReportsSummary);

    return (
      <EntriesFilterForm
        {...props}
        location={location}
        onClear={this._handleClear}
        query={query}
        showAdmin={showAdmin}
      />
    );
  }

  render() {
    const { admin, fetching, location, match, query } = this.props;
    const { pathname } = location;

    const isReports = pathname === '/entries/reports';
    const isReportsSummary = pathname === '/entries/reports/summary';
    const showAdmin = admin && (isReports || isReportsSummary);

    return (
      <div className="p-4">
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-blue-500">{'Entries'}</h1>
          <Button
            as={Link}
            color="blue"
            to={{
              ...location,
              pathname: '/entries/new',
              state: { modal: true }
            }}
          >
            <FontAwesomeIcon icon="plus" /> {'New Entry'}
          </Button>
        </div>
        {admin && this._renderTabs(showAdmin)}
        <div className="border rounded p-4">
          <Formik
            enableReinitialize
            initialValues={query}
            onSubmit={this._handleSubmit}
            render={this._renderForm}
          />
        </div>
        <div className="my-4">
          {showAdmin && <IndexAdminMenu {...this.props} />}
          {!showAdmin && <IndexMenu {...this.props} />}
        </div>
        <Switch>
          {admin && (
            <Route
              path={`${match.url}/reports/summary`}
              render={this._renderSummaryTable}
            />
          )}
          {admin && (
            <Route
              path={`${match.url}/reports`}
              render={this._renderReportsPage}
            />
          )}
          <Route
            path={`${match.url}/summary`}
            render={this._renderSummaryTable}
          />
          <Route exact path={match.url} render={this._renderIndexPage} />
        </Switch>
        <Spinner page spinning={Boolean(fetching)} text={fetching} />
      </div>
    );
  }
}

const props = (state) => {
  return {
    admin: selectAdmin(state),
    fetching: state.entries.fetching,
    query: selectQuery(state),
    savedLocation: state.entries.location,
    timezone: selectTimezone(state)
  };
};

const actions = {
  onSetLocation: setLocation,
  onReset: reset
};

export default connect(
  props,
  actions
)(EntriesIndexStack);
