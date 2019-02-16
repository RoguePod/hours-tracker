import PropTypes from "javascripts/prop-types";
import React from "react";
import { Transition } from "javascripts/shared/components";
import cx from "classnames";

const Button = props => {
  const {
    as,
    children,
    className,
    color,
    disabled,
    textColor,
    ...rest
  } = props;

  const hoverKey = `hover:bg-${color}-dark`;
  const buttonClassName = cx(
    `bg-${color}`,
    `text-${textColor}`,
    "font-bold rounded py-2 px-4 hover:shadow appearance-none",
    {
      "cursor-not-allowed": disabled,
      [hoverKey]: !disabled,
      "opacity-50": disabled
    },
    className
  );

  return (
    <Transition
      {...rest}
      className={buttonClassName}
      disabled={disabled}
      tag={as}
    >
      {children}
    </Transition>
  );
};

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  textColor: PropTypes.string,
  type: PropTypes.string
};

Button.defaultProps = {
  as: "button",
  className: null,
  color: "blue",
  disabled: false,
  textColor: "white",
  type: "button"
};

export default Button;
