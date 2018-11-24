import posed, { PoseGroup } from 'react-pose';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Portal } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

const FadeIn = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

const Page = styled(FadeIn)`
  left: 16rem;
  top: 62px;

  @media (max-width: 768px) {
    left: 0;
  }
`;

const Spinner = ({ page, spinning, text }) => {
  const shadeClassName =
    'pin z-10 overflow-hidden bg-smoke flex items-center ' +
    'justify-center text-white flex-col';

  const children = (
    <React.Fragment>
      <div className="flex flex-row items-center">
        <FontAwesomeIcon
          icon="clock"
          pulse
          size="3x"
        />
      </div>
      {text && text.length > 0 &&
        <div className="pt-4 px-4 text-center">
          {text}
        </div>}
    </React.Fragment>
  );

  if (page) {
    return (
      <Portal>
        <PoseGroup>
          {spinning &&
            <Page
              className={cx(shadeClassName, 'fixed')}
              key="shade"
            >
              {children}
            </Page>}
        </PoseGroup>
      </Portal>
    );
  }

  if (!spinning) {
    return null;
  }

  return (
    <PoseGroup>
      {spinning &&
        <FadeIn
          className={cx(shadeClassName, 'absolute')}
          key="shade"
        >
          {children}
        </FadeIn>}
    </PoseGroup>
  );
};

Spinner.propTypes = {
  page: PropTypes.bool,
  spinning: PropTypes.bool,
  text: PropTypes.string
};

Spinner.defaultProps = {
  page: false,
  spinning: false,
  text: null
};

export default Spinner;
