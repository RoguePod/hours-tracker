import { removeFlash, updateFlash } from 'javascripts/shared/redux/flashes';

import Flash from './Flash';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';

const Flashes = ({ flashes, ...rest }) => {
  const flashChildren = flashes.map((flash) => {
    return <Flash {...rest} flash={flash} key={flash.id} />;
  });

  return <Portal>{flashChildren}</Portal>;
};

Flashes.propTypes = {
  flashes: PropTypes.arrayOf(PropTypes.flash).isRequired
};

const props = (state) => {
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
