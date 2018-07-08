import { Button, Dropdown } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import WeekDropdownItem from './WeekDropdownItem';
import _times from 'lodash/times';
import { history } from 'javascripts/app/redux/store';
import moment from 'moment-timezone';
import styles from './DashboardPage.scss';
import { toQuery } from 'javascripts/globals';

class WeekDropdown extends React.Component {
  static propTypes = {
    location: PropTypes.routerLocation.isRequired,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    timezone: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handlePrevious = this._handlePrevious.bind(this);
    this._handleNext = this._handleNext.bind(this);
    this._handleCurrent = this._handleCurrent.bind(this);
    this._handleDate = this._handleDate.bind(this);
  }

  shouldComponentUpdate() {
    return true;
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

  _getIsCurrent(date, timezone) {
    const currentDate = moment()
      .tz(timezone)
      .startOf('isoWeek');

    return date === currentDate.format('YYYY-MM-DD');
  }

  _getDates(date, timezone) {
    const startDate = moment.tz(date, timezone).format('MM/DD');
    const endDate   = moment.tz(date, timezone)
      .add(6, 'd')
      .endOf('day')
      .format('MM/DD');

    return { endDate, startDate };
  }

  _renderOptions(timezone) {
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

    return options;
  }

  render() {
    const { query: { date }, timezone } = this.props;

    const { endDate, startDate } = this._getDates(date, timezone);
    const isCurrent = this._getIsCurrent(date, timezone);

    return (
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
            {this._renderOptions(timezone)}
          </Dropdown.Menu>
        </Dropdown>
        <Button
          disabled={isCurrent}
          icon="caret right"
          onClick={this._handleNext}
        />
      </Button.Group>
    );
  }
}

export default WeekDropdown;
