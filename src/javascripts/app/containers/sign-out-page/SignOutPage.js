import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { signOutUser } from 'javascripts/app/redux/user';

class SignOutPage extends React.Component {
  static propTypes = {
    onSignOutUser: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { onSignOutUser } = this.props;

    onSignOutUser();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

const props = () => {
  return {};
};

const actions = {
  onSignOutUser: signOutUser
};

export default connect(props, actions)(SignOutPage);
