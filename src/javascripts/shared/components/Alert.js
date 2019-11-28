import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

const Alert = ({ className, color, children, icon, iconSize, remove }) => {
  const alertClasses =
    `bg-${color}-200 border-${color}-500 rounded text-${color}-600 ` +
    `border-t-4 flex`;

  return (
    <div className={cx(alertClasses, className)}>
      {icon && (
        <div className="py-2 pr-4">
          <FontAwesomeIcon icon={icon} size={iconSize} />
        </div>
      )}
      <div className="flex-1 self-center">{children}</div>
      {remove && (
        <div className="p-2 cursor-pointer">
          <FontAwesomeIcon icon="times" />
        </div>
      )}
    </div>
  );
};

Alert.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  iconSize: PropTypes.string,
  remove: PropTypes.bool
};

Alert.defaultProps = {
  className: 'px-4 py-3',
  color: 'green',
  icon: 'exclamation-circle',
  iconSize: '2x',
  remove: false
};

export default Alert;
