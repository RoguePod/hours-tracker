import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Transition } from 'javascripts/shared/components';
import _nth from 'lodash/nth';

class SplitFormChart extends React.Component {
  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired
      })
    ).isRequired
  };

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const { entries } = this.props;

    const colors = [
      'red-500',
      'purple-500',
      'orange-500',
      'green-500',
      'teal-600',
      'blue-500',
      'purple-600',
      'gray-600',
      'red-600',
      'orange-600',
      'green-600',
      'teal-500',
      'blue-600'
    ];

    const segments = entries.map((entry, index) => {
      const color = _nth(colors, index);
      const segmentStyles = {
        flex: Number(entry.percent) * 10
      };

      return (
        <Transition
          className={`h-8 bg-${color}`}
          key={index}
          style={segmentStyles}
        />
      );
    });

    return <div className="flex">{segments}</div>;
  }
}

export default SplitFormChart;
