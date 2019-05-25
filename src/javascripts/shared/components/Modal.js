import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
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

const SlideIn = styled.div`
  &.slide-enter {
    transform: translateY(-6.25rem);
  }

  &.slide-enter-active {
    transform: translateY(0);
    transition: transform ${DURATION}ms ease;
  }

  &.slide-exit {
    transform: translateY(0);
  }

  &.slide-exit-active {
    transform: translateY(-6.25rem);
    transition: transform ${DURATION}ms ease;
  }
`;

const Close = styled.div`
  right: -0.75rem;
  top: -0.75rem;
`;

const Modal = ({ children, onClose, open }) => {
  const [slide, setSlide] = React.useState(open);

  const handleEnter = () => setSlide(true);
  const handleExit = () => setSlide(false);

  const overlayClassName =
    'fixed inset-0 z-40 flex items-center justify-center pt-8 px-4 pb-4 ' +
    'overflow-auto bg-smoke';

  const closeClasses =
    'absolute bg-blue-500 text-white w-8 h-8 flex items-center ' +
    'justify-center rounded-full text-center border-4 border-white z-20 ' +
    'cursor-pointer';

  return (
    <Portal>
      <CSSTransition
        classNames="fade"
        in={open}
        mountOnEnter
        onEnter={handleEnter}
        onExit={handleExit}
        timeout={DURATION}
        unmountOnExit
      >
        <FadeIn className={overlayClassName}>
          <div
            className="absolute inset-0"
            onClick={onClose}
            role="button"
            tabIndex="-1"
          />
          <CSSTransition classNames="slide" in={slide} timeout={DURATION}>
            <SlideIn
              className="bg-white rounded shadow-lg relative"
              initialPose="exit"
            >
              <Close className={closeClasses} onClick={onClose}>
                <FontAwesomeIcon icon="times" />
              </Close>
              {children}
            </SlideIn>
          </CSSTransition>
        </FadeIn>
      </CSSTransition>
    </Portal>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

Modal.defaultProps = {
  onClose: null,
  open: false
};

export default Modal;
