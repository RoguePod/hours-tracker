import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const Button = (props) => {
  const {
    children, className, color, disabled, loading, textColor, ...rest
  } = props;

  const hoverKey = `hover:bg-${color}-dark`;
  const buttonClassName = cx(
    `bg-${color}`,
    `text-${textColor}`,
    'font-bold rounded py-3 px-6 transition hover:shadow',
    {
      'cursor-not-allowed': disabled,
      [hoverKey]: !disabled,
      'opacity-50': disabled
    },
    className
  );

  /* eslint-disable react/button-has-type */
  return (
    <button
      {...rest}
      className={buttonClassName}
      disabled={disabled}
    >
      {loading &&
        <div className="inline-block pr-3">
          <FontAwesomeIcon
            icon="spinner"
            spin
          />
        </div>}
      {children}
    </button>
  );
  /* eslint-enable react/button-has-type */
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  loading: PropTypes.bool,
  textColor: PropTypes.string,
  type: PropTypes.string
};

Button.defaultProps = {
  className: null,
  color: 'blue',
  loading: false,
  textColor: 'white',
  type: 'button'
};

export default Button;
