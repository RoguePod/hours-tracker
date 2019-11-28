import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _times from 'lodash/times';
import cx from 'classnames';
import moment from 'moment-timezone';
// import { toQuery } from 'javascripts/globals';

class WeekDropdown extends React.Component {
  static propTypes = {
    // location: PropTypes.routerLocation.isRequired,
    query: PropTypes.shape({
      date: PropTypes.string.isRequired
    }).isRequired,
    timezone: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this._handlePrevious = this._handlePrevious.bind(this);
    this._handleNext = this._handleNext.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handlePrevious() {
    // const {
    //   location,
    //   query: { date },
    //   timezone
    // } = this.props;
    // const currentDate = moment.tz(date, timezone);
    // const newQuery = {
    //   date: currentDate.subtract(7, 'd').format('YYYY-MM-DD')
    // };
    // history.replace({ ...location, search: `?${toQuery(newQuery)}` });
  }

  _handleNext() {
    // const {
    //   location,
    //   query: { date },
    //   timezone
    // } = this.props;
    // const currentDate = moment.tz(date, timezone);
    // const newQuery = {
    //   date: currentDate.add(7, 'd').format('YYYY-MM-DD')
    // };
    // history.replace({ ...location, search: `?${toQuery(newQuery)}` });
  }

  _handleChange(event) {
    // const { location, timezone } = this.props;
    // const date = event.target.value;
    // const currentDate = moment()
    //   .tz(timezone)
    //   .startOf('isoWeek')
    //   .format('YYYY-MM-DD');
    // if (date === currentDate) {
    //   history.replace({ ...location, search: null });
    // } else {
    //   history.replace({ ...location, search: `?${toQuery({ date })}` });
    // }
  }

  _extraOption() {
    const {
      query: { date },
      timezone
    } = this.props;

    const weekStart = moment.tz(date, timezone);
    const weekEnd = moment
      .tz(date, timezone)
      .add(6, 'd')
      .endOf('day')
      .format('MM/DD');

    return (
      <option
        key={weekStart.format('YYYY-MM-DD')}
        value={weekStart.format('YYYY-MM-DD')}
      >
        {`${weekStart.format('MM/DD')} - ${weekEnd}`}
      </option>
    );
  }

  _renderOptions(isCurrent) {
    const {
      query: { date },
      timezone
    } = this.props;
    const options = [];

    let found = isCurrent;

    _times(4, (index) => {
      const weeks = index + 1;
      const weekStart = moment
        .tz(timezone)
        .startOf('isoWeek')
        .subtract(weeks, 'w');

      const weekEnd = moment
        .tz(timezone)
        .startOf('isoWeek')
        .subtract(weeks, 'w')
        .add(6, 'd')
        .endOf('day')
        .format('MM/DD');

      if (!found && date === weekStart.format('YYYY-MM-DD')) {
        found = true;
      }

      options.push(
        <option
          key={weekStart.format('YYYY-MM-DD')}
          value={weekStart.format('YYYY-MM-DD')}
        >
          {`${weekStart.format('MM/DD')} - ${weekEnd}`}
        </option>
      );
    });

    if (!found) {
      options.push(this._extraOption());
    }

    return options;
  }

  render() {
    const {
      query: { date },
      timezone
    } = this.props;

    const currentDate = moment()
      .tz(timezone)
      .startOf('isoWeek')
      .format('YYYY-MM-DD');

    const isCurrent = date === currentDate;

    const baseButtonClasses = 'bg-blue p-3 text-white';

    const leftButtonClasses = cx(
      baseButtonClasses,
      'rounded-l hover:bg-blue-dark'
    );

    const rightButtonClasses = cx(baseButtonClasses, 'rounded-r', {
      'cursor-not-allowed opacity-50': isCurrent,
      'hover:bg-blue-dark': !isCurrent
    });

    const selectClasses =
      'block bg-blue text-white appearance-none outline-none px-4 py-2 pr-10 ' +
      'h-full cursor-pointer';

    const arrowClasses =
      'pointer-events-none absolute pin-y pin-r flex items-center px-4 ' +
      'text-white';

    return (
      <div className="flex flex-row justify-center">
        <button
          className={leftButtonClasses}
          onClick={this._handlePrevious}
          type="button"
        >
          <FontAwesomeIcon icon="caret-left" />
        </button>
        <div className="relative">
          <select
            className={selectClasses}
            onChange={this._handleChange}
            value={date}
          >
            <option value={currentDate}>{'Current Week'}</option>
            {this._renderOptions(isCurrent)}
          </select>
          <div className={arrowClasses}>
            <FontAwesomeIcon icon="caret-down" />
          </div>
        </div>
        <button
          className={rightButtonClasses}
          disabled={isCurrent}
          onClick={this._handleNext}
          type="button"
        >
          <FontAwesomeIcon icon="caret-right" />
        </button>
      </div>
    );
  }
}

export default WeekDropdown;
