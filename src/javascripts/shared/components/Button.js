import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const Button = (props) => {
  const {
    as, children, className, color, disabled, loading, textColor, ...rest
  } = props;

  const hoverKey = `hover:bg-${color}-dark`;
  const buttonClassName = cx(
    `bg-${color}`,
    `text-${textColor}`,
    'font-bold rounded py-2 px-4 transition hover:shadow appearance-none',
    {
      'cursor-not-allowed': disabled,
      [hoverKey]: !disabled,
      'opacity-50': disabled
    },
    className
  );

  const Tag = as;

  return (
    <Tag
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
    </Tag>
  );
};

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  textColor: PropTypes.string,
  type: PropTypes.string
};

Button.defaultProps = {
  as: 'button',
  className: null,
  color: 'blue',
  disabled: false,
  loading: false,
  textColor: 'white',
  type: 'button'
};

export default Button;
