/* global document */

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _padStart from 'lodash/padStart';
import moment from 'moment-timezone';
import styles from './Timer.scss';

class Timer extends React.Component {
  static propTypes = {
    entry: PropTypes.entry.isRequired
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
    const { duration } = this.state;

    return (
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
    const { entry } = this.props;

    if (!entry) {
      return;
    }

    const now       = moment().tz(entry.timezone);
    const startedAt = moment.tz(entry.startedAt, entry.timezone);
    const duration  = moment.duration(now.diff(startedAt));

    const hours    = _padStart(duration.get('hours'), 2, '0');
    const minutes  = _padStart(duration.get('minutes'), 2, '0');
    const seconds  = _padStart(duration.get('seconds'), 2, '0');

    document.title = `${hours}:${minutes}:${seconds} - Hours Tracker`;

    this.setState({ duration });
  }

  render() {
    // const { entry: { startedAt, timezone } } = this.props;
    const { duration } = this.state;

    if (!duration) {
      return null;
    }

    // const abbr = moment.tz.zone(timezone).abbr(startedAt);

    const hours   = _padStart(duration.get('hours'), 2, '0');
    const minutes = _padStart(duration.get('minutes'), 2, '0');
    const seconds = _padStart(duration.get('seconds'), 2, '0');

    return (
      <div className={styles.container}>
        <div className={styles.number}>
          {hours}
        </div>
        <div className={styles.separator}>
          {':'}
        </div>
        <div className={styles.number}>
          {minutes}
        </div>
        <div className={styles.separator}>
          {':'}
        </div>
        <div className={styles.number}>
          {seconds}
        </div>
      </div>
    );
  }
}

export default Timer;
