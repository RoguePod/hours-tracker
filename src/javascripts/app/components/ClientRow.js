import PropTypes from 'javascripts/prop-types';
import React from 'react';

class ClientRow extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    onClientClick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleClick() {
    const { client, onClientClick } = this.props;

    onClientClick(client);
  }

  render() {
    const { client } = this.props;
    const clientClasses =
      'hover:bg-blue-lightest cursor-pointer px-3 py-2 text-sm';

    return (
      <li
        className={clientClasses}
        onClick={this._handleClick}
      >
        {client.name}
      </li>
    );
  }
}

export default ClientRow;
