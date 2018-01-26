import { Menu } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

class PaginationLink extends React.Component {
  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleClick() {
    const { onPage, page, disabled, active } = this.props;

    if (page && !disabled && !active) {
      onPage(page);
    }

    return false;
  }

  render() {
    const { active, disabled, children } = this.props;

    return (
      <Menu.Item
        active={active}
        disabled={disabled}
        onClick={this._handleClick}
      >
        {children}
      </Menu.Item>
    );
  }
}

PaginationLink.propTypes = {
  active: PropTypes.bool,
  /* eslint-disable react/forbid-prop-types */
  children: PropTypes.any.isRequired,
  /* eslint-enable react/forbid-prop-types */
  disabled: PropTypes.bool,
  onPage: PropTypes.func.isRequired,
  page: PropTypes.number
};

PaginationLink.defaultProps = {
  active: false,
  disabled: false,
  page: null
};

export default PaginationLink;
