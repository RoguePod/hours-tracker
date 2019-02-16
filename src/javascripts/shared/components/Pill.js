import { Link } from "react-router-dom";
import PropTypes from "javascripts/prop-types";
import React from "react";
import cx from "classnames";

const Pill = ({ as, children, className, selected, ...rest }) => {
  const pillClasses = cx("block rounded py-2 px-4", {
    "bg-blue text-white": selected,
    "hover:bg-blue-lighter text-blue": !selected
  });

  const Tag = as;

  return (
    <Tag {...rest} className={cx(pillClasses, className)}>
      {children}
    </Tag>
  );
};

Pill.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  className: PropTypes.string,
  selected: PropTypes.bool
};

Pill.defaultProps = {
  as: Link,
  children: null,
  className: null,
  selected: false
};

export default Pill;
