import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const Label = ({ children, className, error, ...rest }) => {
  const labelClassName = cx(
    'block text-gray-700 text-sm font-bold mb-2',
    {
      'text-gray-700': !error,
      'text-red-500': error
    },
    className
  );

  return (
    <label {...rest} className={labelClassName}>
      {children}
    </label>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  error: PropTypes.bool
};

Label.defaultProps = {
  className: null,
  error: false
};

export default Label;
