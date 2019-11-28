import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

const Container = styled.div`
  transition-property: height;
  transition-timing-function: ease;
`;

const Collapse = ({ children, duration, open }) => {
  const [height, setHeight] = React.useState(null);

  const _handleEnter = (_node) => {
    setHeight(0);
  };

  const _handleEntering = (node) => {
    setHeight(node.scrollHeight);
  };

  const _handleEntered = (_node) => {
    setHeight(null);
  };

  const _handleExit = (node) => {
    setHeight(node.scrollHeight);
  };

  const _handleExiting = (node) => {
    const _unused = node.offsetHeight; // eslint-disable-line no-unused-vars
    setHeight(0);
  };

  const _handleExited = (_node) => {
    setHeight(0);
  };

  const defaultStyle = {
    height,
    transitionDuration: `${duration}ms`
  };

  const transitionStyles = {
    entering: { overflow: 'hidden' },
    exited: { overflow: 'hidden' },
    exiting: { overflow: 'hidden' }
  };

  return (
    <Transition
      in={open}
      mountOnEnter
      onEnter={_handleEnter}
      onEntered={_handleEntered}
      onEntering={_handleEntering}
      onExit={_handleExit}
      onExited={_handleExited}
      onExiting={_handleExiting}
      timeout={duration}
    >
      {(state) => {
        return (
          <Container
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            {children}
          </Container>
        );
      }}
    </Transition>
  );
};

Collapse.propTypes = {
  children: PropTypes.node.isRequired,
  duration: PropTypes.number,
  open: PropTypes.bool
};

Collapse.defaultProps = {
  duration: 500,
  open: false
};

export default Collapse;
