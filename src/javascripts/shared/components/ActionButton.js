import ConfirmAction from './ConfirmAction';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Tooltip from './Tooltip';
import cx from 'classnames';

const ActionButton = (props) => {
  const {
    as, children, className, color, confirm, onClick, size, title, ...rest
  } = props;

  const actionClasses = cx(
    `text-white bg-${color} hover:bg-${color}-dark shadow hover:shadow-md`,
    `cursor-pointer w-${size} h-${size} items-center justify-center`,
    'transition flex rounded-full appearance-none',
    className
  );

  const Tag = as;

  let action = (
    <Tag
      {...rest}
      className={actionClasses}
      onClick={confirm ? null : onClick}
    >
      {children}
    </Tag>
  );

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
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  confirm: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.number,
  title: PropTypes.string
};

ActionButton.defaultProps = {
  as: 'button',
  className: null,
  color: 'green',
  confirm: null,
  onClick: null,
  size: 10,
  title: null
};

export default ActionButton;
