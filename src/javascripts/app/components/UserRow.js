import PropTypes from 'javascripts/prop-types';
import React from 'react';

class UserRow extends React.Component {
  static propTypes = {
    onUserClick: PropTypes.func.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleClick() {
    const { user, onUserClick } = this.props;

    onUserClick(user);
  }

  render() {
    const { user } = this.props;
    const userClasses =
      'hover:bg-blue-lighter cursor-pointer px-3 py-2 text-sm transition ' +
      'text-blue';

    return (
      <li
        className={userClasses}
        onClick={this._handleClick}
      >
        {user.name}
      </li>
    );
  }
}

export default UserRow;
