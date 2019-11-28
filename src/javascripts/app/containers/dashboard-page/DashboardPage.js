import { selectAdmin, selectTimezone } from 'javascripts/shared/redux/app';

import AdminMenu from './AdminMenu';
import EntriesTable from './EntriesTable';
import ProjectsTable from './ProjectsTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Spinner } from 'javascripts/shared/components';
import UsersTable from './UsersTable';
import WeekDropdown from './WeekDropdown';
import { connect } from 'react-redux';
import styled from 'styled-components';

/* stylelint-disable unit-whitelist */
const Hr = styled.hr`
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  height: 0;
`;
/* stylelint-enable unit-whitelist */

class DashboardPage extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    fetching: PropTypes.string,
    location: PropTypes.routerLocation.isRequired,
    onReset: PropTypes.func.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        client: PropTypes.client,
        project: PropTypes.project
      })
    ).isRequired,
    projectsAdmin: PropTypes.arrayOf(
      PropTypes.shape({
        client: PropTypes.client,
        project: PropTypes.project
      })
    ).isRequired,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    running: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired
  };

  static defaultProps = {
    fetching: null
  };

  constructor(props) {
    super(props);

    this._handleStartInterval = this._handleStartInterval.bind(this);
    this._handleStopInterval = this._handleStopInterval.bind(this);
  }

  componentDidMount() {
    const { onSubscribeEntries, running } = this.props;

    onSubscribeEntries();

    if (running) {
      this._handleStartInterval();
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const {
      running,
      onSubscribeEntries,
      query: { date }
    } = this.props;

    if (prevProps.query.date !== date) {
      onSubscribeEntries();
    }

    if (!prevProps.running && running) {
      this._handleStartInterval();
    } else if (prevProps.running && !running) {
      this._handleStopInterval();
    }
  }

  componentWillUnmount() {
    const { onReset } = this.props;

    onReset();

    this._handleStopInterval();
  }

  interval = null;

  _handleStartInterval() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 1000 * 60 * 6);
  }

  _handleStopInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { admin, fetching, location, projectsAdmin } = this.props;
    const { hash } = location;

    return (
      <div className="p-4">
        <div className="flex flex-wrap justify-center items-center pb-4">
          <WeekDropdown {...this.props} />
        </div>

        {admin && <AdminMenu location={location} />}
        {(!admin || hash === '') && <ProjectsTable {...this.props} />}
        {admin && hash === '#users' && <UsersTable {...this.props} />}
        {admin && hash === '#projects' && (
          <ProjectsTable {...this.props} projects={projectsAdmin} user={null} />
        )}
        <Hr />

        <h2 className="text-blue mb-2">{'Latest Entries'}</h2>
        <EntriesTable location={location} />
        <Spinner
          page
          spinning={Boolean(fetching)}
          text="Loading Dashboard..."
        />
      </div>
    );
  }
}

const props = (state) => {
  return {
    admin: selectAdmin(state),
    // entries: selectEntries(state),
    // fetching: state.dashboard.fetching,
    // projects: selectDashboardProjectsForUser(state),
    // projectsAdmin: selectDashboardProjects(state),
    // query: selectQuery(state),
    // running: Boolean(state.running.entry),
    timezone: selectTimezone(state)
    // user: state.app.user,
    // users: selectDashboardUsers(state)
  };
};

const actions = {
  // onReset: reset,
  // onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(DashboardPage);
