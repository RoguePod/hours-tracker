/* globals document,Element */

import { CSSTransition } from 'react-transition-group';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import styled from 'styled-components';

const DURATION = 300;

const Container = styled.div`
  max-height: ${(props) => props.maxHeight || 'none'};
`;

const FadeIn = styled.div`
  top: calc(100% + 0.3rem);
  transform-origin: center top;

  &.fade-enter {
    opacity: 0.01;
    transform: scale(0.75);
  }

  &.fade-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: all ${DURATION}ms ease;
  }

  &.fade-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.fade-exit-active {
    opacity: 0.01;
    transform: scale(0.75);
    transition: all ${DURATION}ms ease;
  }
`;

const Dropdown = (props) => {
  const { children, error, maxHeight, onClose, open, target } = props;

  const [previousChildren, setPreviousChildren] = React.useState(null);

  const handleClose = (event) => {
    if (!(target && target.current.contains(event.target))) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (target && onClose) {
      if (open) {
        document.addEventListener('mousedown', handleClose, false);
        setPreviousChildren(null);
      } else {
        document.removeEventListener('mousedown', handleClose, false);
      }
    }
  }, [open]);

  if (!_isEqual(children, previousChildren)) {
    setPreviousChildren(children);
  }

  const dropdownClasses = cx(
    'bg-white rounded z-10 overflow-hidden border ' +
      'shadow-lg absolute inset-x-0',
    {
      'border-transparent': !error,
      'border-red-500': error
    }
  );

  const containerClasses = cx('overflow-x-hidden overflow-y-auto');

  return (
    <CSSTransition
      classNames="fade"
      in={open}
      mountOnEnter
      timeout={DURATION}
      unmountOnExit
    >
      <FadeIn className={dropdownClasses}>
        <Container className={containerClasses} maxHeight={maxHeight}>
          {open ? children : previousChildren}
        </Container>
      </FadeIn>
    </CSSTransition>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.bool,
  maxHeight: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  target: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
};

Dropdown.defaultProps = {
  error: false,
  maxHeight: 'none',
  onClose: null,
  open: false,
  target: null
};

export default Dropdown;
