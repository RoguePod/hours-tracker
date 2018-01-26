import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _nth from 'lodash/nth';
import styles from './SplitFormChart.scss';

class SplitFormChart extends React.Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.shape({
      percent: PropTypes.string.isRequired
    })).isRequired
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const { entries } = this.props;

    const colors = [
      'red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet',
      'purple', 'pink', 'brown', 'grey', 'black'
    ];

    const segments = entries.map((entry, index) => {
      const segmentStyles = {
        backgroundColor: _nth(colors, index),
        flex: Number(entry.percent) * 10
      };

      return (
        <div
          className={styles.segment}
          key={index}
          style={segmentStyles}
        />
      );
    });

    return (
      <div className={styles.container}>
        {segments}
      </div>
    );
  }
}

export default SplitFormChart;
