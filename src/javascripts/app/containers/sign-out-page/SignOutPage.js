import PropTypes from "javascripts/prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { signOutUser } from "javascripts/app/redux/app";

class SignOutPage extends React.Component {
  static propTypes = {
    onSignOutUser: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { onSignOutUser } = this.props;

    onSignOutUser();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <Redirect to="/sign-in" />;
  }
}

const props = () => {
  return {};
};

const actions = {
  onSignOutUser: signOutUser
};

export default connect(
  props,
  actions
)(SignOutPage);
