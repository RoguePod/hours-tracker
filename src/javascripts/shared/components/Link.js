import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import cx from 'classnames';

const Link = ({ children, className, ...rest }) => {
  const linkClassName = cx(
    'hover:text-blue-600 hover:underline text-blue-500',
    className
  );

  return (
    <RouterLink {...rest} className={linkClassName}>
      {children}
    </RouterLink>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

Link.defaultProps = {
  className: null
};

export default Link;
