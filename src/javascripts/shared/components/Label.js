import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const Label = ({ children, className, error, ...rest }) => {
  const labelClassName = cx(
    'block text-grey-darker text-sm font-bold mb-2',
    {
      'text-grey-darker': !error,
      'text-red': error
    },
    className
  );

  return (
    <label
      {...rest}
      className={labelClassName}
    >
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
  className: '',
  error: false
};

export default Label;
