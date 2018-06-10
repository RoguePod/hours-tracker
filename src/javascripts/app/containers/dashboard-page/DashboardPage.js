import {
  Button, Dimmer, Divider, Dropdown, Header, Loader, Segment
} from 'semantic-ui-react';
import {
  reset, selectDashboardProjects, selectDashboardProjectsForUser,
  selectDashboardUsers, selectQuery, subscribeEntries
} from 'javascripts/app/redux/dashboard';
import { selectAdmin, selectTimezone } from 'javascripts/app/redux/app';

import AdminMenu from './AdminMenu';
import EntriesTable from './EntriesTable';
import ProjectsTable from './ProjectsTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import UsersTable from './UsersTable';
import WeekDropdownItem from './WeekDropdownItem';
import _times from 'lodash/times';
import { connect } from 'react-redux';
import { history } from 'javascripts/app/redux/store';
import moment from 'moment-timezone';
import styles from './DashboardPage.scss';
import { toQuery } from 'javascripts/globals';

class DashboardPage extends React.Component {
  static propTypes = {
    admin: PropTypes.bool.isRequired,
    entries: PropTypes.arrayOf(PropTypes.entry).isRequired,
    fetching: PropTypes.string,
    location: PropTypes.routerLocation.isRequired,
    onReset: PropTypes.func.isRequired,
    onSubscribeEntries: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(PropTypes.shape({
      client: PropTypes.client,
      project: PropTypes.project
    })).isRequired,
    projectsAdmin: PropTypes.arrayOf(PropTypes.shape({
      client: PropTypes.client,
      project: PropTypes.project
    })).isRequired,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    running: PropTypes.entry,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    fetching: null,
    running: null
  }

  constructor(props) {
    super(props);

    this._handlePrevious = this._handlePrevious.bind(this);
    this._handleNext = this._handleNext.bind(this);
    this._handleCurrent = this._handleCurrent.bind(this);
    this._handleDate = this._handleDate.bind(this);
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
      running, onSubscribeEntries, query: { date }
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

  interval = null

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

  _handlePrevious() {
    const { location, query: { date }, timezone } = this.props;

    const currentDate = moment.tz(date, timezone);

    const newQuery = {
      date: currentDate.subtract(7, 'd').format('YYYY-MM-DD')
    };

    history.replace({ ...location, search: `?${toQuery(newQuery)}` });
  }

  _handleNext() {
    const { location, query: { date }, timezone } = this.props;

    const currentDate = moment.tz(date, timezone);

    const newQuery = {
      date: currentDate.add(7, 'd').format('YYYY-MM-DD')
    };

    history.replace({ ...location, search: `?${toQuery(newQuery)}` });
  }

  _handleCurrent() {
    const { location } = this.props;

    history.replace({ ...location, search: null });
  }

  _handleDate(date) {
    const { location } = this.props;

    history.replace({ ...location, search: `?${toQuery({ date })}` });
  }

  render() {
    const {
      admin, fetching, location, projectsAdmin, query: { date },
      timezone
    } = this.props;

    const { hash } = location;

    const startDate = moment.tz(date, timezone).format('MM/DD');
    const endDate   = moment.tz(date, timezone)
      .add(6, 'd')
      .endOf('day')
      .format('MM/DD');

    const currentDate = moment()
      .tz(timezone)
      .startOf('isoWeek');

    const isCurrent = date === currentDate.format('YYYY-MM-DD');

    const options = [];

    _times(4, (index) => {
      const weeks = index + 1;
      const weekStart = moment.tz(timezone)
        .startOf('isoWeek')
        .subtract(weeks, 'w');

      const weekEnd = moment.tz(timezone)
        .startOf('isoWeek')
        .subtract(weeks, 'w')
        .add(6, 'd')
        .endOf('day')
        .format('MM/DD');

      options.push(
        <WeekDropdownItem
          key={`${weekStart.format('MM/DD')} - ${weekEnd}`}
          onClick={this._handleDate}
          startDate={weekStart}
          text={`${weekStart.format('MM/DD')} - ${weekEnd}`}
        />
      );
    });

    return (
      <Segment
        basic
        className={styles.container}
      >
        <div className={styles.headerWrapper}>
          <Button.Group
            className={styles.buttons}
            color="blue"
            size="large"
          >
            <Button
              icon="caret left"
              onClick={this._handlePrevious}
            />
            <Dropdown
              button
              text={`${startDate} - ${endDate}`}
            >
              <Dropdown.Menu>
                {!isCurrent &&
                  <Dropdown.Item
                    onClick={this._handleCurrent}
                  >
                    {'Current Week'}
                  </Dropdown.Item>}
                {!isCurrent && <Dropdown.Divider />}
                {options}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              disabled={isCurrent}
              icon="caret right"
              onClick={this._handleNext}
            />
          </Button.Group>
        </div>
        <Dimmer
          active={Boolean(fetching)}
          inverted
        >
          <Loader>
            {fetching}
          </Loader>
        </Dimmer>

        {admin && <AdminMenu location={location} />}
        {(!admin || hash === '') &&
          <ProjectsTable
            {...this.props}
          />}
        {admin && hash === '#users' &&
          <UsersTable
            {...this.props}
          />}
        {admin && hash === '#projects' &&
          <ProjectsTable
            {...this.props}
            projects={projectsAdmin}
            user={null}
          />}
        <Divider />

        <Header
          as="h2"
          color="blue"
        >
          {'Latest Entries'}
        </Header>
        <EntriesTable />
      </Segment>
    );
  }
}

const props = (state) => {
  return {
    admin: selectAdmin(state),
    entries: state.dashboard.entries,
    fetching: state.dashboard.fetching,
    projects: selectDashboardProjectsForUser(state),
    projectsAdmin: selectDashboardProjects(state),
    query: selectQuery(state),
    running: state.running.entry,
    timezone: selectTimezone(state),
    user: state.app.user,
    users: selectDashboardUsers(state)
  };
};

const actions = {
  onReset: reset,
  onSubscribeEntries: subscribeEntries
};

export default connect(props, actions)(DashboardPage);
