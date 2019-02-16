import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import cx from "classnames";

const PaginationLink = ({ active, className, children, disabled, ...rest }) => {
  const containerClasses = cx("block px-4 py-2", className, {
    "bg-blue": active,
    "cursor-not-allowed text-grey-light": disabled,
    "cursor-pointer hover:bg-grey-lighter": !active && !disabled,
    "text-white": active
  });

  if (active || disabled) {
    return <div className={containerClasses}>{children}</div>;
  }

  return (
    <Link {...rest} className={containerClasses}>
      {children}
    </Link>
  );
};

PaginationLink.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

PaginationLink.defaultProps = {
  active: false,
  className: null,
  disabled: false
};

export default PaginationLink;
