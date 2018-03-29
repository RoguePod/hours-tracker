import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import moment from 'moment-timezone';

class WeekDropdownItem extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    startDate: PropTypes.instanceOf(moment).isRequired,
    text: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this._handleClick = this._handleClick.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  _handleClick() {
    const { onClick, startDate } = this.props;

    onClick(startDate.format('YYYY-MM-DD'));
  }

  render() {
    const { text } = this.props;

    return (
      <Dropdown.Item
        onClick={this._handleClick}
      >
        {text}
      </Dropdown.Item>
    );
  }
}

export default WeekDropdownItem;
