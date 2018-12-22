import ConfirmAction from './ConfirmAction';
import Icon from './Icon';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Tooltip from './Tooltip';
import cx from 'classnames';

const ActionIcon = ({ className, confirm, onClick, title, ...rest }) => {
  let action = (
    <Icon
      {...rest}
      className={cx(className, 'cursor-pointer')}
      onClick={confirm ? null : onClick}
    />
  );

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

  if (title) {
    action = (
      <Tooltip
        title={title}
      >
        {action}
      </Tooltip>
    );
  }

  return action;
};

ActionIcon.propTypes = {
  className: PropTypes.string,
  confirm: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string
};

ActionIcon.defaultProps = {
  className: null,
  confirm: null,
  onClick: null,
  title: null
};

export default ActionIcon;
