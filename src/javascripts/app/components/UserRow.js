import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Transition } from 'javascripts/shared/components';

class UserRow extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this._handleMouseDown = this._handleMouseDown.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleMouseDown() {
    const { onChange, user } = this.props;

    onChange(user);
  }

  render() {
    const { user } = this.props;
    const userClasses =
      'hover:bg-blue-300 cursor-pointer px-3 py-2 text-sm text-blue-500';

    return (
      <li>
        <Transition
          className={userClasses}
          onMouseDown={this._handleMouseDown}
          role="button"
          tabIndex="-1"
        >
          {user.name}
        </Transition>
      </li>
    );
  }
}

export default UserRow;
