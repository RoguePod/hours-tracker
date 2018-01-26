import {
  Button, Dimmer, Divider, Header, Loader, Menu, Segment
} from 'semantic-ui-react';
import {
  reset, selectDashboardProjects, selectDashboardProjectsForUser,
  selectDashboardUsers, selectQuery, subscribeEntries
} from 'javascripts/app/redux/dashboard';
import { selectAdmin, selectTimezone } from 'javascripts/app/redux/app';

import EntriesTable from './EntriesTable';
import { Link } from 'react-router-dom';
import ProjectsTable from './ProjectsTable';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import UsersTable from './UsersTable';
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

  componentWillReceiveProps(nextProps) {
    const {
      running, onSubscribeEntries, query: { date }
    } = this.props;

    if (date !== nextProps.query.date) {
      onSubscribeEntries();
    }

    if (!running && nextProps.running) {
      this._handleStartInterval();
    } else if (running && !nextProps.running) {
      this._handleStopInterval();
    }
  }

  shouldComponentUpdate() {
    return true;
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

  render() {
    const {
      admin, fetching, location, projectsAdmin, query: { date },
      timezone
    } = this.props;

    const { hash } = location;

    const startDate = moment.tz(date, timezone).format('MM/DD/YYYY');
    const endDate   = moment.tz(date, timezone)
      .add(6, 'd')
      .endOf('day')
      .format('MM/DD/YYYY');

    return (
      <Segment
        basic
        className={styles.container}
      >
        <Header
          as="h1"
          color="blue"
        >
          <Button.Group
            floated="right"
          >
            <Button
              color="blue"
              onClick={this._handlePrevious}
            >
              {'Previous Week'}
            </Button>
            <Button
              color="blue"
              onClick={this._handleNext}
            >
              {'Next Week'}
            </Button>
          </Button.Group>
          {`Week of ${startDate} - ${endDate}`}
        </Header>
        <Dimmer
          active={Boolean(fetching)}
          inverted
        >
          <Loader>
            {fetching}
          </Loader>
        </Dimmer>

        {admin &&
          <Menu
            color="blue"
          >
            <Menu.Item
              active={hash === ''}
              as={Link}
              icon="dashboard"
              name="My Dashboard"
              replace
              to={{ ...location, hash: '' }}
            />
            <Menu.Item
              active={hash === '#users'}
              as={Link}
              icon="users"
              name="Users"
              replace
              to={{ ...location, hash: '#users' }}
            />
            <Menu.Item
              active={hash === '#projects'}
              as={Link}
              icon="table"
              name="Projects"
              replace
              to={{ ...location, hash: '#projects' }}
            />
          </Menu>}
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
