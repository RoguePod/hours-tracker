import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './Modal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class ConfirmAction extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string
  };

  static defaultProps = {
    message: null,
    onClick: null,
    title: null
  };

  constructor(props) {
    super(props);

    this._handleOpen = this._handleOpen.bind(this);
    this._handleConfirm = this._handleConfirm.bind(this);
    this._handleClose = this._handleClose.bind(this);
  }

  state = {
    open: false
  };

  shouldComponentUpdate() {
    return true;
  }

  _handleOpen(event) {
    this.setState({ event, open: true });
  }

  _handleConfirm() {
    const { event } = this.state;
    const { onClick } = this.props;

    if (onClick) {
      onClick(event);
    }

    this._handleClose();
  }

  _handleClose() {
    this.setState({ event: null, open: false });
  }

  render() {
    const { children, message, ...rest } = this.props;
    const { open } = this.state;

    const child = React.Children.only(children);
    const trigger = React.cloneElement(child, {
      ...rest,
      onClick: this._handleOpen
    });

    return (
      <>
        {trigger}
        <Modal onClose={this._handleClose} open={open}>
          <div className="flex flex-col items-center p-4">
            <FontAwesomeIcon
              className="text-red"
              icon="exclamation-circle"
              size="4x"
            />
            <div className="text-2xl py-4 text-center max-w-lg">{message}</div>
            <div>
              <Button color="green" onClick={this._handleConfirm}>
                {'Confirm'}
              </Button>{' '}
              <Button color="red" onClick={this._handleClose}>
                {'Cancel'}
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default ConfirmAction;
