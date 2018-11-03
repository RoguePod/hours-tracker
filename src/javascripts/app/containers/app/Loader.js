import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Portal } from 'javascripts/shared/components';
// import PropTypes from 'javascripts/prop-types';
import React from 'react';
// import cx from 'classnames';

const Loader = () => {
  return (
    <Portal>
      <div className="fixed pin z-50 overflow-auto bg-smoke-light flex items-center justify-center text-white">
        <FontAwesomeIcon
          icon="spinner"
          size="3x"
          spin
        />
      </div>
    </Portal>
  );
};

Loader.propTypes = {
  // children: PropTypes.node.isRequired,
  // className: PropTypes.string,
  // color: PropTypes.string,
  // loading: PropTypes.bool,
  // textColor: PropTypes.string,
  // type: PropTypes.string
};

Loader.defaultProps = {
  // className: '',
  // color: 'blue',
  // loading: false,
  // textColor: 'white',
  // type: 'button'
};

export default Loader;
