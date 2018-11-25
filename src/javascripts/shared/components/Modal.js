import posed, { PoseGroup } from 'react-pose';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styled from 'styled-components';

const duration = 200;

const FadeIn = posed.div({
  enter: { beforeChildren: true, opacity: 1, transition: { duration } },
  exit: { opacity: 0, transition: { duration } }
});

/* eslint-disable id-length */
const SlideIn = posed.div({
  enter: {
    opacity: 1,
    transition: {
      default: { duration },
      y: -50
    },
    y: 0
  },
  exit: {
    opacity: 0,
    transition: { duration },
    y: -50
  }
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

  state = {
    ready: false,
    show: false
  }

  componentDidMount() {
    const { open } = this.props;

    this.setState({ ready: open });
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { open } = this.props;
    const { ready, show } = this.state;

    if (open && !prevProps.open) {
      this.setState({ ready: true });
    } else if (!open && prevProps.open) {
      this.setState({ show: false });
    }

    if (!show) {
      if (ready && !prevState.ready) {
        this.setState({ show: true });
      } else if (ready && prevState.ready) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
          this.setState({ ready: false });
        }, duration);
      }
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null

  render() {
    const { children, onClose } = this.props;
    const { ready, show } = this.state;

    if (!ready) {
      return null;
    }

    const overlayClassName =
      'fixed pin z-40 flex items-center justify-center pt-8 px-4 pb-4 ' +
      'overflow-auto bg-smoke';

    const slideInClasses =
      'bg-white rounded shadow-lg relative';

    const closeClasses =
      'absolute bg-blue text-white w-8 h-8 flex items-center cursor-pointer ' +
      'justify-center rounded-full text-center border-4 border-white';

    return (
      <Portal>
        <PoseGroup>
          {show &&
            <FadeIn
              className={overlayClassName}
              key="overlay"
            >
              <div
                className="absolute pin"
                onClick={onClose}
              />
              <SlideIn
                className={slideInClasses}
                pose={show ? 'enter' : 'exit'}
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
            </FadeIn>}
        </PoseGroup>
      </Portal>
    );
  }
}

export default Modal;
