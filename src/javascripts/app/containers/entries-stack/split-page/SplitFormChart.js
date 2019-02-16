import PropTypes from "javascripts/prop-types";
import React from "react";
import { Transition } from "javascripts/shared/components";
import _nth from "lodash/nth";

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
      "red",
      "purple",
      "orange",
      "green",
      "teal-dark",
      "blue",
      "purple-dark",
      "grey-dark",
      "red-dark",
      "orange-dark",
      "green-dark",
      "teal",
      "blue-dark"
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
