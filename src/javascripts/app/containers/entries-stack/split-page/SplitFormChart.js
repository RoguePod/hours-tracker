import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _nth from 'lodash/nth';

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
      'red', 'purple', 'orange', 'yellow-darker', 'green', 'teal-dark', 'blue',
      'purple-dark', 'grey-dark', 'red-dark', 'orange-dark',
      'yellow-light', 'green-dark', 'teal', 'blue-dark'
    ];

    const segments = entries.map((entry, index) => {
      const color = _nth(colors, index);
      const segmentStyles = {
        flex: Number(entry.percent) * 10
      };

      return (
        <div
          className={`h-8 bg-${color} transition`}
          key={index}
          style={segmentStyles}
        />
      );
    });

    return (
      <div className="flex">
        {segments}
      </div>
    );
  }
}

export default SplitFormChart;
