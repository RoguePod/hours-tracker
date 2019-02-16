import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "javascripts/prop-types";
import React from "react";
import Transition from "./Transition";
import cx from "classnames";

/* eslint-disable react/prefer-stateless-function */
class Icon extends React.PureComponent {
  static propTypes = {
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    size: PropTypes.number
  };

  static defaultProps = {
    as: "div",
    className: null,
    color: "green",
    disabled: false,
    size: 10
  };

  render() {
    const { as, className, color, disabled, icon, size, ...rest } = this.props;

    const iconClasses = cx(
      "text-white shadow hover:shadow-md",
      `w-${size} h-${size} items-center justify-center`,
      "flex rounded-full appearance-none",
      className,
      {
        "bg-grey-dark": disabled,
        [`bg-${color} hover:bg-${color}-dark`]: !disabled
      }
    );

    return (
      <Transition {...rest} className={iconClasses} tag={as}>
        <FontAwesomeIcon icon={icon} />
      </Transition>
    );
  }
}
/* eslint-disable react/prefer-stateless-function */

export default Icon;
