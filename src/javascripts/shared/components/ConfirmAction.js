import { Confirm } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styles from './ConfirmAction.scss';

class ConfirmAction extends React.PureComponent {
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

    this._handleClick = this._handleClick.bind(this);
    this._handleConfirm = this._handleConfirm.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
  }

  state = {
    confirm: false
  }

  _handleClick() {
    this.setState({ confirm: true });
  }

  _handleConfirm() {
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }

    this.setState({ confirm: false });
  }

  _handleCancel() {
    this.setState({ confirm: false });
  }

  render() {
    const { children, message, ...rest } = this.props;
    const { confirm } = this.state;

    return (
      <span
        className={styles.container}
        {...rest}
        onClick={this._handleClick}
      >
        {children}
        <Confirm
          content={message}
          onCancel={this._handleCancel}
          onConfirm={this._handleConfirm}
          open={confirm}
        />
      </span>
    );
  }
}

export default ConfirmAction;
