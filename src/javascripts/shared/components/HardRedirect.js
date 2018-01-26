import PropTypes from 'javascripts/prop-types';
import React from 'react';

class HardRedirect extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired
  }

  componentDidMount() {
    const { to } = this.props;

    /* eslint-disable no-undef */
    window.location = to;
    /* eslint-enable no-undef */
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

export default HardRedirect;
