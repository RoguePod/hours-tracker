import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import Transition from './Transition';
import _includes from 'lodash/includes';
import cx from 'classnames';

// NOTE: MUST BE CLASS COMPONENT OTHERWISE TOOLTIP WON'T WORK WITH IT

/* eslint-disable react/prefer-stateless-function */
class Icon extends React.PureComponent {
  static propTypes = {
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    size: PropTypes.number,
    textColor: PropTypes.string
  };

  static defaultProps = {
    as: 'div',
    className: null,
    color: 'green',
    disabled: false,
    size: 10,
    textColor: 'white'
  };

  render() {
    let { textColor } = this.props;
    const { as, className, color, disabled, icon, size, ...rest } = this.props;

    delete rest.textColor;

    const staticColors = ['smoke', 'black', 'white', 'transparent'];
    if (!_includes(staticColors, textColor)) {
      textColor = `${textColor}-500`;
    }

    const iconClasses = cx(
      `text-${textColor} w-${size} h-${size} items-center justify-center`,
      'flex rounded-full appearance-none',
      className,
      {
        'shadow hover:shadow-md': color !== 'transparent',
        'bg-gray-600': disabled,
        [`bg-${color}-500 hover:bg-${color}-600`]: !disabled
      }
    );

    return (
      <Transition {...rest} className={iconClasses} tag={as}>
        <FontAwesomeIcon icon={icon} />
      </Transition>
    );
  }
}
/* eslint-disable react/prefer-stateless-function */

export default Icon;
