import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Transition from './Transition';
import cx from 'classnames';

const Button = React.forwardRef((props, ref) => {
  const {
    background,
    backgroundHover,
    children,
    className,
    color,
    defaultClassName,
    disabled,
    tag,
    ...rest
  } = props;

  const buttonClassName = cx(
    defaultClassName,
    `${background} ${color} inline-block`,
    'font-bold rounded hover:shadow select-none appearance-none leading-tight',
    'focus:outline-none outline-none hover:no-underline',
    {
      [`hover:${backgroundHover} focus:${backgroundHover}`]: !disabled,
      'cursor-not-allowed opacity-50 pointer-events-none': disabled
    },
    className
  );

  const base = {};

  if (tag === 'button') {
    base.type = 'button';
  }

  return (
    <Transition
      {...base}
      {...rest}
      className={buttonClassName}
      disabled={disabled}
      ref={ref}
      tag={tag}
    >
      {children}
    </Transition>
  );
});

Button.propTypes = {
  background: PropTypes.string,
  backgroundHover: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  defaultClassName: PropTypes.string,
  disabled: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  tag: PropTypes.any
};

Button.defaultProps = {
  background: 'bg-blue-500',
  backgroundHover: 'bg-blue-600',
  className: null,
  color: 'text-white',
  defaultClassName: 'py-2 px-4',
  disabled: false,
  tag: 'button'
};

export default Button;
