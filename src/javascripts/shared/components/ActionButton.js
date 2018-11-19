import ConfirmAction from './ConfirmAction';
import { Link } from 'react-router-dom';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Tooltip from './Tooltip';
import cx from 'classnames';

const ActionButton = (props) => {
  const {
    as, children, className, color, confirm, onClick, title, ...rest
  } = props;

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
        onClick={confirm ? null : onClick}
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
    action = (
      <Tooltip
        title={title}
      >
        {action}
      </Tooltip>
    );
  }

  if (confirm && confirm.length > 0) {
    action = (
      <ConfirmAction
        message={confirm}
        onClick={onClick}
      >
        {action}
      </ConfirmAction>
    );
  }

  return action;
};

ActionButton.propTypes = {
  as: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  confirm: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string
};

ActionButton.defaultProps = {
  as: 'button',
  className: null,
  color: 'green',
  confirm: null,
  onClick: null,
  title: null
};

export default ActionButton;
