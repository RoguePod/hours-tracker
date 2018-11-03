import posed, { PoseGroup } from 'react-pose';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Portal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FadeIn = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const Loader = ({ loading }) => {
  const shadeClassName =
    'fixed pin z-10 overflow-auto bg-white flex items-center justify-center ' +
    'text-blue flex-col';

  return (
    <Portal>
      <PoseGroup>
        {loading &&
          <FadeIn
            className={shadeClassName}
            key="shade"
          >
            <div className="flex flex-row items-center">
              <FontAwesomeIcon
                icon="clock"
                pulse
                size="3x"
              />
              <div className="pl-2 text-4xl">
                {'Hours Tracker'}
              </div>
            </div>
          </FadeIn>}
      </PoseGroup>
    </Portal>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool
};

Loader.defaultProps = {
  loading: false
};

export default Loader;
