import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const Label = (props) => {
  const {
    children, className, error, ...rest
  } = props;

  const labelClassName = cx(
    'block text-grey-darker text-sm font-bold mb-2',
    {
      'text-grey-darker': !error,
      'text-red': error
    },
    className
  );

  /* eslint-disable react/button-has-type */
  return (
    <label
      {...rest}
      className={labelClassName}
    >
      {children}
    </label>
  );
  /* eslint-enable react/button-has-type */
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
