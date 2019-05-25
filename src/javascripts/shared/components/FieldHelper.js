import { CSSTransition } from 'react-transition-group';
import Collapse from './Collapse';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
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

class FieldHelper extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    open: PropTypes.bool
  };

  static defaultProps = {
    className: null,
    message: null,
    open: false
  };

  constructor(props) {
    super(props);

    this.state = {
      message: props.message,
      slide: props.open && !isBlank(props.message)
    };

    this._handleEnter = this._handleEnter.bind(this);
    this._handleExit = this._handleExit.bind(this);
  }

  componentDidUpdate() {
    const { message } = this.props;
    const { message: stateMessage } = this.state;

    if (message && message !== stateMessage) {
      this.setState({ message });
    }
  }

  _handleEnter() {
    this.setState({ slide: true });
  }

  _handleExit() {
    this.setState({ slide: false });
  }

  render() {
    const { className, open } = this.props;
    const { message, slide } = this.state;

    const isOpen = open && !isBlank(message);

    const messageClasses = cx('text-sm pt-1', className);

    return (
      <CSSTransition
        classNames="fade"
        in={isOpen}
        mountOnEnter
        onEnter={this._handleEnter}
        onExit={this._handleExit}
        timeout={DURATION}
        unmountOnExit
      >
        <FadeIn>
          <Collapse duration={DURATION} open={slide}>
            <div className={messageClasses}>{message}</div>
          </Collapse>
        </FadeIn>
      </CSSTransition>
    );
  }
}

export default FieldHelper;
