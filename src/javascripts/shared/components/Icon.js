import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

/* eslint-disable react/prefer-stateless-function */
class Icon extends React.PureComponent {
  static propTypes = {
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.string.isRequired,
    size: PropTypes.number
  };

  static defaultProps = {
    as: 'div',
    className: null,
    color: 'green',
    size: 10
  }

  render() {
    const { as, className, color, icon, size, ...rest } = this.props;
    const iconClasses = cx(
      `text-white bg-${color} hover:bg-${color}-dark shadow hover:shadow-md`,
      `w-${size} h-${size} items-center justify-center`,
      'transition flex rounded-full appearance-none',
      className
    );

    const Tag = as;

    return (
      <Tag
        {...rest}
        className={iconClasses}
      >
        <FontAwesomeIcon
          icon={icon}
        />
      </Tag>
    );
  }
}
/* eslint-disable react/prefer-stateless-function */

export default Icon;
