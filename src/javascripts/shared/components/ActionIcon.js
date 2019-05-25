import ConfirmAction from './ConfirmAction';
import Icon from './Icon';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Tooltip from './Tooltip';
import cx from 'classnames';

const ActionIcon = (props) => {
  const { className, confirm, disabled, onClick, title, ...rest } = props;

  const actionClasses = cx(className, {
    'cursor-not-allowed': disabled,
    'cursor-pointer': !disabled
  });

  let action = (
    <Icon
      {...rest}
      className={actionClasses}
      disabled={disabled}
      onClick={!disabled && !confirm ? onClick : null}
    />
  );

  if (!disabled && confirm && confirm.length > 0) {
    action = (
      <ConfirmAction message={confirm} onClick={onClick}>
        {action}
      </ConfirmAction>
    );
  }

  if (title) {
    return <Tooltip title={title}>{action}</Tooltip>;
  }

  return action;
};

ActionIcon.propTypes = {
  className: PropTypes.string,
  confirm: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string
};

ActionIcon.defaultProps = {
  className: null,
  confirm: null,
  disabled: false,
  onClick: null,
  title: null
};

export default ActionIcon;
