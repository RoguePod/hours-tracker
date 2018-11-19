import posed, { PoseGroup } from 'react-pose';

import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Portal from './Portal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const duration = 150;

const FadeIn = posed.div({
  enter: { opacity: 1, transition: { duration } },
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

class ConfirmAction extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string,
    onClick: PropTypes.func
  }

  static defaultProps = {
    message: null,
    onClick: null
  }

  constructor(props) {
    super(props);

    this._handleOpen = this._handleOpen.bind(this);
    this._handleConfirm = this._handleConfirm.bind(this);
    this._handleClose = this._handleClose.bind(this);
  }

  state = {
    open: false,
    show: false
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  timeout = null

  _handleOpen() {
    this.setState({ open: true }, () => {
      this.setState({ show: true });
    }, 1);
  }

  _handleConfirm() {
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }

    this._handleClose();
  }

  _handleClose() {
    this.setState({ show: false }, () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.setState({ open: false });
      }, duration);
    });
  }

  render() {
    const { children, message } = this.props;
    const { open, show } = this.state;

    const overlayClassName =
      'fixed pin z-30 overflow-auto flex items-center justify-center';

    return (
      <React.Fragment>
        <span
          onClick={this._handleOpen}
        >
          {children}
        </span>
        {open &&
          <Portal>
            <div className={overlayClassName}>
              <PoseGroup>
                {show &&
                  <FadeIn
                    className="absolute pin bg-smoke"
                    key="overlay"
                    onClick={this._handleClose}
                  />}
                {show &&
                  <SlideIn
                    className="flex flex-col items-center bg-white p-4 rounded z-40"
                    key="modal"
                    pose={show ? 'enter' : 'exit'}
                  >
                    <FontAwesomeIcon
                      className="text-red"
                      icon="exclamation-circle"
                      size="4x"
                    />
                    <div className="text-2xl py-4">
                      {message}
                    </div>
                    <div>
                      <Button
                        color="green"
                        onClick={this._handleConfirm}
                      >
                        {'Confirm'}
                      </Button>
                      {' '}
                      <Button
                        color="red"
                        onClick={this._handleClose}
                      >
                        {'Cancel'}
                      </Button>
                    </div>
                  </SlideIn>}
              </PoseGroup>
            </div>
          </Portal>}
      </React.Fragment>
    );
  }
}

export default ConfirmAction;
