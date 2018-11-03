import posed, { PoseGroup } from 'react-pose';

import Flash from './Flash';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { removeFlash } from 'javascripts/shared/redux/flashes';
import styled from 'styled-components';

const Container = styled.div`
  bottom: 1rem;
`;

/* eslint-disable id-length */
const FlashWrapper = posed.div({
  enter: {
    delay: 250,
    opacity: 1,
    transition: {
      default: { duration: 300 },
      y: { damping: 15, stiffness: 1000, type: 'spring' }
    },
    y: 0
  },
  exit: {
    opacity: 0,
    transition: { duration: 250 },
    y: 50
  }
});
/* eslint-disable id-length */

const Flashes = (props) => {
  const { flashes } = props;

  const flashChildren = flashes.map((flash) => {
    return (
      <FlashWrapper
        className="max-w-sm mx-auto"
        key={flash.id}
      >
        <Flash
          {...props}
          flash={flash}
        />
      </FlashWrapper>
    );
  });

  return (
    <Container
      className="fixed w-full"
    >
      <PoseGroup>
        {flashChildren}
      </PoseGroup>
    </Container>
  );
}

Flashes.propTypes = {
  flashes: PropTypes.arrayOf(PropTypes.flash).isRequired
};

const props = (state) => {
  return {
    flashes: state.flashes.flashes
  };
};

const actions = {
  onRemoveFlash: removeFlash
};

export default connect(props, actions)(Flashes);
