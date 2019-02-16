import { removeFlash, updateFlash } from "javascripts/shared/redux/flashes";

import Flash from "./Flash";
import { Portal } from "javascripts/shared/components";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _isEqual from "lodash/isEqual";
import { connect } from "react-redux";

class Flashes extends React.Component {
  static propTypes = {
    flashes: PropTypes.arrayOf(PropTypes.flash).isRequired
  };

  shouldComponentUpdate(nextProps) {
    const { flashes } = this.props;

    return !_isEqual(flashes, nextProps.flashes);
  }

  render() {
    const { flashes } = this.props;

    const flashChildren = flashes.map(flash => {
      return <Flash {...this.props} flash={flash} key={flash.id} />;
    });

    return <Portal>{flashChildren}</Portal>;
  }
}

const props = state => {
  return {
    flashes: state.flashes.flashes
  };
};

const actions = {
  onRemoveFlash: removeFlash,
  onUpdateFlash: updateFlash
};

export default connect(
  props,
  actions
)(Flashes);
