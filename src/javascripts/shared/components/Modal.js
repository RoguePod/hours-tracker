import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import posed from 'react-pose';
import styled from 'styled-components';

const duration = 250;

const FadeIn = posed.div({
  enter: { opacity: 1, transition: { duration } },
  exit: { opacity: 0, transition: { duration } }
});

/* eslint-disable id-length */
const SlideIn = posed.div({
  enter: { opacity: 1, transition: { duration }, y: 0 },
  exit: { opacity: 0, transition: { duration }, y: -100 }
});
/* eslint-disable id-length */

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
      closing: false,
      open: props.open
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.open && !nextProps.open) {
      return { closing: true, open: false };
    }

    return { open: nextProps.open };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(_prevProps, prevState) {
    const { closing } = this.state;

    if (!prevState.closing && closing) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.setState({ closing: false });
      }, duration);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = null;
  }

  timeout = null

  render() {
    const { children, onClose } = this.props;
    const { closing, open } = this.state;

    if (!open && !closing) {
      return null;
    }

    const overlayClassName =
      'fixed pin z-40 flex items-center justify-center pt-8 px-4 pb-4 ' +
      'overflow-auto bg-smoke';

    const closeClasses =
      'absolute bg-blue text-white w-8 h-8 flex items-center cursor-pointer ' +
      'justify-center rounded-full text-center border-4 border-white z-20';

    return (
      <Portal>
        <FadeIn
          className={overlayClassName}
          initialPose="exit"
          pose={open ? 'enter' : 'exit'}
        >
          <div
            className="absolute pin"
            onClick={onClose}
          />
          <SlideIn
            className="bg-white rounded shadow-lg relative"
            initialPose="exit"
            pose={open ? 'enter' : 'exit'}
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
        </FadeIn>
      </Portal>
    );
  }
}

export default Modal;
