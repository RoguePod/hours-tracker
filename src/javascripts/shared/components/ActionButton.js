import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Tooltip from './Tooltip';
import cx from 'classnames';

const ActionButton = (props) => {
  const { as, children, className, color, title, ...rest } = props;

  const actionClasses = cx(
    `text-white bg-${color} hover:bg-${color}-dark shadow hover:shadow-md`,
    'cursor-pointer rounded-full w-10 h-10 items-center justify-center flex',
    'transition',
    className
  );

  let action = null;

  if (as === 'button') {
    action = (
      <button
        {...rest}
        className={actionClasses}
        type="button"
      >
        {children}
      </button>
    );
  } else if (as === 'Link') {
    action = (
      <Link
        {...rest}
        className={actionClasses}
      >
        {children}
      </Link>
    );
  }

  if (title) {
    return (
      <Tooltip
        title={title}
      >
        {action}
      </Tooltip>
    );
  }

  return action;
};

ActionButton.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string
};

ActionButton.defaultProps = {
  as: 'button',
  className: null,
  color: 'green',
  title: null
};

export default ActionButton;
