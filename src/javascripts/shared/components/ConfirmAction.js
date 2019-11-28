import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from './Modal';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const ConfirmAction = ({ children, message, onClick, ...rest }) => {
  const [state, setState] = React.useState({ event: null, open: false });
  const { disabled } = rest;

  const { event, open } = state;

  const _handleOpen = (openEvent) => {
    if (!disabled) {
      setState({ event: openEvent, open: true });
    }
  };

  const _handleConfirm = () => {
    if (onClick) {
      onClick(event);
    }

    _handleClose();
  };

  const _handleClose = () => setState({ event: null, open: false });

  const child = React.Children.only(children);
  const trigger = React.cloneElement(child, {
    ...rest,
    ...child.props,
    disabled,
    onClick: _handleOpen
  });

  return (
    <>
      {trigger}
      <Modal onClose={_handleClose} open={open}>
        <div className="flex flex-col items-center p-4">
          <FontAwesomeIcon
            className="text-red-500"
            icon="exclamation-circle"
            size="4x"
          />
          <div className="text-2xl py-4 text-center max-w-lg">{message}</div>
          <div>
            <Button color="green" onClick={_handleConfirm}>
              {'Confirm'}
            </Button>{' '}
            <Button color="red" onClick={_handleClose}>
              {'Cancel'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

ConfirmAction.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  message: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string
};

ConfirmAction.defaultProps = {
  disabled: false,
  message: null,
  onClick: null,
  title: null
};

export default ConfirmAction;
