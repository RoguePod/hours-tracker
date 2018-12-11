import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import posed from 'react-pose';
import styled from 'styled-components';

const duration = 125;

const FadeIn = posed.div({
  enter: { beforeChildren: true, opacity: 1, transition: { duration } },
  exit: { afterChildren: true, opacity: 0, transition: { duration } }
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
      open: props.open,
      show: props.open
    };

    this._handlePoseComplete = this._handlePoseComplete.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;

    if (open && !prevProps.open) {
      this.setState({ open: true, show: true });
    } else if (!open && prevProps.open) {
      this.setState({ open: false });
    }
  }

  _handlePoseComplete() {
    const { open } = this.state;

    this.setState({ show: open });
  }

  render() {
    const { children, onClose } = this.props;
    const { open, show } = this.state;

    if (!show) {
      return null;
    }

    const overlayClassName =
      'fixed pin z-40 flex items-center justify-center pt-8 px-4 pb-4 ' +
      'overflow-auto bg-smoke';

    const closeClasses =
      'absolute bg-blue text-white w-8 h-8 flex items-center cursor-pointer ' +
      'justify-center rounded-full text-center border-4 border-white';

    return (
      <Portal>
        <FadeIn
          className={overlayClassName}
          initialPose="exit"
          onPoseComplete={this._handlePoseComplete}
          pose={open ? 'enter' : 'exit'}
        >
          <div
            className="absolute pin"
            onClick={onClose}
          />
          <SlideIn
            className="bg-white rounded shadow-lg relative"
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
