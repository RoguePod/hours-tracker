import posed, { PoseGroup } from 'react-pose';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FadeIn = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const Spinner = ({ spinning, text }) => {
  const shadeClassName =
    'absolute pin z-10 overflow-hidden bg-smoke flex items-center ' +
    'justify-center text-white flex-col';

  return (
    <PoseGroup>
      {spinning &&
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
          </div>
          {text && text.length > 0 &&
            <div className="pt-4">
              {text}
            </div>}
        </FadeIn>}
    </PoseGroup>
  );
};

Spinner.propTypes = {
  spinning: PropTypes.bool,
  text: PropTypes.string
};

Spinner.defaultProps = {
  spinning: false,
  text: null
};

export default Spinner;
