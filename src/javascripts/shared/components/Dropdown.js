/* globals Element */

import { CSSTransition } from 'react-transition-group';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import styled from 'styled-components';

const Container = styled.div`
  max-height: ${(props) => props.maxHeight || 'none'};
`;

const FadeIn = styled.div`
  transform-origin: center top;

  &.fade-enter {
    opacity: 0.01;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: all ${({ duration }) => duration}ms ease;
  }

  &.fade-exit {
    opacity: 1;
  }

  &.fade-exit-active {
    opacity: 0.01;
    transition: all ${({ duration }) => duration}ms ease;
  }
`;

const Dropdown = ({
  children,
  className,
  duration,
  error,
  maxHeight,
  onClose,
  open,
  style,
  target
}) => {
  const element = React.useRef(null);
  const [previousChildren, setPreviousChildren] = React.useState(null);
  const [position, setPosition] = React.useState('top-100');

  React.useEffect(() => {
    const _handleClose = (event) => {
      if (target?.current && !target.current.contains(event.target)) {
        onClose();
      }
    };

    if (target && onClose) {
      if (open) {
        document.addEventListener('mousedown', _handleClose, false);
        document.addEventListener('touchend', _handleClose, false);
        setPreviousChildren(null);
      }
    }

    return () => {
      if (target && onClose) {
        document.removeEventListener('mousedown', _handleClose, false);
        document.removeEventListener('touchend', _handleClose, false);
      }
    };
  }, [open, onClose, target]);

  React.useEffect(() => {
    if (open && element.current) {
      const rect = element.current.getBoundingClientRect();

      if (
        window.innerHeight > rect.height &&
        window.innerHeight < rect.bottom
      ) {
        setPosition('bottom-100');
      } else {
        setPosition('top-100');
      }
    }
  }, [open]);

  if (!_isEqual(children, previousChildren)) {
    setPreviousChildren(children);
  }

  let dropdownClasses = className;
  if (!dropdownClasses) {
    dropdownClasses = cx(
      'bg-white rounded z-20 overflow-hidden border shadow-lg',
      {
        'border-gray-300': !error,
        'border-red-500': error
      }
    );
  }

  dropdownClasses = cx(dropdownClasses, 'absolute', position);

  const containerClasses = 'overflow-x-hidden overflow-y-auto w-full';

  return (
    <CSSTransition
      classNames="fade"
      in={open}
      mountOnEnter
      timeout={duration}
      unmountOnExit
    >
      <FadeIn className={dropdownClasses} duration={duration} style={style}>
        <Container
          className={containerClasses}
          maxHeight={maxHeight}
          ref={element}
        >
          {open ? children : previousChildren}
        </Container>
      </FadeIn>
    </CSSTransition>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  duration: PropTypes.number,
  error: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  style: PropTypes.shape({
    borderTop: PropTypes.string
  }),
  target: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
};

Dropdown.defaultProps = {
  className: null,
  duration: 200,
  error: false,
  maxHeight: 'none',
  onClose: null,
  open: false,
  style: {},
  target: null
};

export default Dropdown;
