import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Transition } from 'javascripts/shared/components';

class ClientRow extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this._handleMouseDown = this._handleMouseDown.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleMouseDown() {
    const { client, onChange } = this.props;

    onChange(client);
  }

  render() {
    const { client } = this.props;
    const clientClasses =
      'hover:bg-blue-lighter cursor-pointer px-3 py-2 text-sm text-blue';

    return (
      <li>
        <Transition
          className={clientClasses}
          onMouseDown={this._handleMouseDown}
          role="button"
          tabIndex="-1"
        >
          {client.name}
        </Transition>
      </li>
    );
  }
}

export default ClientRow;
