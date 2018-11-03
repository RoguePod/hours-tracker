import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class Flash extends React.Component {
  static propTypes = {
    flash: PropTypes.flash.isRequired,
    onRemoveFlash: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this._handleRemove = this._handleRemove.bind(this);
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this._handleRemove();
    }, 3000);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null

  _handleRemove() {
    const { onRemoveFlash, flash: { id } } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    onRemoveFlash(id);
  }

  render() {
    const { flash } = this.props;

    const color = flash.color || 'green';
    const icon = flash.icon || 'exclamation-circle';

    const alertClasses =
      `bg-${color}-lightest border-${color} rounded text-${color}-darkest ` +
      'border-t-4  px-4 py-3 shadow-lg flex items-center m-4';

    return (
      <div
        className={alertClasses}
        onClick={this._handleRemove}
      >
        <div className="p-2">
          <FontAwesomeIcon
            icon={icon}
          />
        </div>
        <div className="flex-1">
          {flash.message}
        </div>
        <div className="p-2 cursor-pointer">
          <FontAwesomeIcon
            icon="times"
          />
        </div>
      </div>
    );
  }
}

export default Flash;
