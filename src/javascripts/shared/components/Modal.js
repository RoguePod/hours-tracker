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
    transform: translateY(-100px);
  }

  &.slide-enter-active {
    transform: translateY(0);
    transition: transform ${DURATION}ms ease;
  }

  &.slide-exit {
    transform: translateY(0);
  }

  &.slide-exit-active {
    transform: translateY(-100px);
    transition: transform ${DURATION}ms ease;
  }
`;

const Close = styled.div`
  top: -0.75rem;
  right: -0.75rem;
`;

class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    open: PropTypes.bool
  }

  static defaultProps = {
    onClose: null,
    open: false
  }

  constructor(props) {
    super(props);

    this.state = {
      slide: props.open
    };

    this._handleEnter = this._handleEnter.bind(this);
    this._handleExit = this._handleExit.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleEnter() {
    this.setState({ slide: true });
  }

  _handleExit() {
    this.setState({ slide: false });
  }

  render() {
    const { children, onClose, open } = this.props;
    const { slide } = this.state;

    const overlayClassName =
      'fixed pin z-40 flex items-center justify-center pt-8 px-4 pb-4 ' +
      'overflow-auto bg-smoke';

    const closeClasses =
      'absolute bg-blue text-white w-8 h-8 flex items-center cursor-pointer ' +
      'justify-center rounded-full text-center border-4 border-white z-20';

    return (
      <Portal>
        <CSSTransition
          classNames="fade"
          in={open}
          mountOnEnter
          onEnter={this._handleEnter}
          onExit={this._handleExit}
          timeout={DURATION}
          unmountOnExit
        >
          <FadeIn
            className={overlayClassName}
          >
            <div
              className="absolute pin"
              onClick={onClose}
            />
            <CSSTransition
              classNames="slide"
              in={slide}
              timeout={DURATION}
            >
              <SlideIn
                className="bg-white rounded shadow-lg relative"
                initialPose="exit"
              >
                <Close
                  className={closeClasses}
                  onClick={onClose}
                >
                  <FontAwesomeIcon
                    icon="times"
                  />
                </Close>
                {children}
              </SlideIn>
            </CSSTransition>
          </FadeIn>
        </CSSTransition>

      </Portal>
    );
  }
}

export default Modal;
