import { CSSTransition } from 'react-transition-group';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import _isElement from 'lodash/isElement';
import cx from 'classnames';
import styled from 'styled-components';

const DURATION = 300;

const FadeIn = styled.div`
  &.fade-enter {
    opacity: 0.01;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease;
  }

  &.fade-exit {
    opacity: 1;
  }

  &.fade-exit-active {
    opacity: 0.01;
    transition: opacity ${DURATION}ms ease;
  }
`;

const Title = styled(FadeIn)`
  transform: translate(-50%, -100%) !important;

  &::after {
    border: solid transparent;
    border-color: rgba(136, 183, 213, 0);
    border-top-color: #22292f;
    border-width: 0.75rem;
    content: ' ';
    height: 0;
    left: 50%;
    margin-left: -0.75rem;
    pointer-events: none;
    position: absolute;
    top: 95%;
    width: 0;
  }
`;

const Tooltip = ({ children, title, onMouseEnter, onMouseLeave, ...rest }) => {
  const [element, setElement] = React.useState(null);
  const [hover, setHover] = React.useState(false);

  const handleMouseEnter = (event) => {
    setHover(true);

    if (onMouseEnter) {
      onMouseEnter(event);
    }
  };

  const handleMouseLeave = (event) => {
    setHover(false);

    if (onMouseLeave) {
      onMouseLeave(event);
    }
  };

  const titleClasses = cx(
    'fixed bg-black text-white p-2 rounded text-sm z-20 shadow-md',
    'text-center'
  );

  let tooltipStyles = {};
  if (element) {
    const rect = element.getBoundingClientRect();

    tooltipStyles = {
      left: rect.left + rect.width / 2,
      top: rect.top - 10
    };
  }

  const child = React.Children.only(children);
  const trigger = React.cloneElement(child, {
    ...rest,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ref: (node) => {
      // Keep your own reference
      if (_isElement(node)) {
        setElement(node);
      } else {
        /* eslint-disable react/no-find-dom-node */
        setElement(ReactDOM.findDOMNode(node));
        /* eslint-enable react/no-find-dom-node */
      }

      // Call the original ref, if any
      const { ref } = child;

      if (typeof ref === 'function') {
        ref(node);
      }
    }
  });

  return (
    <>
      {trigger}
      {element && (
        <Portal>
          <CSSTransition
            classNames="fade"
            in={hover}
            mountOnEnter
            timeout={DURATION}
            unmountOnExit
          >
            <Title className={titleClasses} style={tooltipStyles}>
              {title}
            </Title>
          </CSSTransition>
        </Portal>
      )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  title: PropTypes.string.isRequired
};

Tooltip.defaultProps = {
  onMouseEnter: null,
  onMouseLeave: null
};

export default Tooltip;
