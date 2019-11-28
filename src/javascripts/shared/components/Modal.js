import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

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

const OVERLAY_CLASS_NAME =
  'fixed inset-0 z-70 flex overflow-auto items-center justify-center outline-none bg-smoke p-4 md:pt-12';

const SLIDE_CLASS_NAME = 'relative bg-white shadow-lg rounded';

const CLOSE_CLASS_NAME =
  'absolute bg-teal-500 text-white flex items-center cursor-pointer w-8 ' +
  'h-8 justify-center rounded-full text-center border-4 border-white z-20';

const Modal = ({ children, className, onClose, open }) => {
  const target = React.useRef(null);
  const [previousChildren, setPreviousChildren] = React.useState(null);
  const [slide, setSlide] = React.useState(open);
  const height = useSelector((state) => state.app.height);

  const _handleEnter = () => setSlide(true);
  const _handleExit = () => setSlide(false);

  const _handleClose = (event) => {
    if (onClose && target?.current && !target.current.contains(event.target)) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : null;

    if (open) {
      setPreviousChildren(children);
    }

    return () => {
      document.body.style.overflow = null;
    };
  }, [children, open]);

  const overlayStyle = {};
  if (target.current && height < target.current.offsetHeight) {
    overlayStyle.alignItems = 'flex-start';
  }

  return (
    <Portal>
      <CSSTransition
        classNames="fade"
        in={open}
        mountOnEnter
        onEnter={_handleEnter}
        onExit={_handleExit}
        timeout={DURATION}
        unmountOnExit
      >
        <FadeIn
          className={OVERLAY_CLASS_NAME}
          onClick={_handleClose}
          style={overlayStyle}
        >
          <CSSTransition classNames="slide" in={slide} timeout={DURATION}>
            <SlideIn className={cx(SLIDE_CLASS_NAME, className)} ref={target}>
              {onClose && (
                <Close className={CLOSE_CLASS_NAME} onClick={onClose}>
                  <FontAwesomeIcon icon="times" />
                </Close>
              )}
              {open ? children : previousChildren}
            </SlideIn>
          </CSSTransition>
        </FadeIn>
      </CSSTransition>
    </Portal>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

Modal.defaultProps = {
  className: null,
  onClose: null,
  open: false
};

export default Modal;
