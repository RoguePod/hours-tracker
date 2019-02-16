import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "javascripts/prop-types";
import React from "react";
import { Transition } from "javascripts/shared/components";
import cx from "classnames";

const Icon = ({ as, className, color, disabled, icon, size, ...rest }) => {
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
};

Icon.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  size: PropTypes.number
};

Icon.defaultProps = {
  as: "div",
  className: null,
  color: "green",
  disabled: false,
  size: 10
};

export default Icon;
