/* global document */

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _padStart from 'lodash/padStart';
import cx from 'classnames';
import moment from 'moment-timezone';

class Timer extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    entry: PropTypes.entry.isRequired
  }

  static defaultProps = {
    disabled: false
  }

  constructor(props) {
    super(props);

    this._handleTick = this._handleTick.bind(this);
  }

  state = {
    duration: null
  }

  componentDidMount() {
    this._handleTick();
    this.interval = setInterval(this._handleTick, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { disabled } = this.props;
    const { duration } = this.state;

    return (
      disabled !== nextProps.disabled ||
      duration !== nextState.duration
    );
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    document.title = 'Hours Tracker';
  }

  interval = null

  _handleTick() {
    const { disabled, entry } = this.props;
    const { duration: currentDuration } = this.state;

    if (disabled) {
      if (currentDuration) {
        this.setState({ duration: null });
        document.title = 'Hours Tracker';
      }

      return;
    }

    const now       = moment().tz(entry.timezone);
    const startedAt = moment.tz(entry.startedAt, entry.timezone);
    const duration  = moment.duration(now.diff(startedAt));

    const hours = _padStart(duration.get('hours'), 2, '0');
    const minutes = _padStart(duration.get('minutes'), 2, '0');
    const seconds = _padStart(duration.get('seconds'), 2, '0');

    document.title = `${hours}:${minutes}:${seconds} - Hours Tracker`;

    this.setState({ duration });
  }

  render() {
    const { disabled } = this.props;
    const { duration } = this.state;

    let hours   = '00';
    let minutes = '00';
    let seconds = '00';

    if (duration) {
      hours = _padStart(duration.get('hours'), 2, '0');
      minutes = _padStart(duration.get('minutes'), 2, '0');
      seconds = _padStart(duration.get('seconds'), 2, '0');
    }

    const numberClasses = cx(
      'rounded text-center px-2 text-3xl flex-1',
      {
        'bg-blue': !disabled,
        'bg-grey-dark': disabled
      }
    );

    const separatorClasses = cx(
      'text-center text-3xl px-2',
      {
        'text-blue': !disabled,
        'text-grey-dark': disabled
      }
    );

    const containerClasses =
      'flex flex-row flex-no-wrap items-center justify-center text-white ' +
      'font-mono';

    return (
      <div className={containerClasses}>
        <div className={numberClasses}>
          {hours}
        </div>
        <div className={separatorClasses}>
          {':'}
        </div>
        <div className={numberClasses}>
          {minutes}
        </div>
        <div className={separatorClasses}>
          {':'}
        </div>
        <div className={numberClasses}>
          {seconds}
        </div>
      </div>
    );
  }
}

export default Timer;
