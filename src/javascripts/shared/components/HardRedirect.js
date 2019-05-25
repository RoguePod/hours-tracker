/* global window */

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const HardRedirect = ({ to }) => {
  React.useEffect(() => {
    window.location = to;
  });

  return null;
};

HardRedirect.propTypes = {
  to: PropTypes.string.isRequired
};

export default HardRedirect;
