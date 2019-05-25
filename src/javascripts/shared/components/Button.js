import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Transition } from 'javascripts/shared/components';
import _includes from 'lodash/includes';
import cx from 'classnames';

const Button = (props) => {
  let { textColor } = props;
  const { as, children, className, color, disabled, ...rest } = props;

  const staticColors = ['smoke', 'black', 'white', 'transparent'];
  if (!_includes(staticColors, textColor)) {
    textColor = `${textColor}-500`;
  }

  delete rest.textColor;

  const buttonClassName = cx(
    `bg-${color}-500`,
    `text-${textColor}`,
    'font-bold rounded hover:shadow appearance-none',
    {
      'cursor-not-allowed': disabled,
      [`hover:bg-${color}-600`]: !disabled,
      'opacity-50': disabled
    },
    className
  );

  return (
    <Transition
      {...rest}
      className={buttonClassName}
      disabled={disabled}
      tag={as}
    >
      {children}
    </Transition>
  );
};

Button.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  textColor: PropTypes.string,
  type: PropTypes.string
};

Button.defaultProps = {
  as: 'button',
  className: 'py-2 px-4',
  color: 'blue',
  disabled: false,
  textColor: 'white',
  type: 'button'
};

export default Button;
