/* globals document,Element */

import { CSSTransition } from "react-transition-group";
import PropTypes from "javascripts/prop-types";
import React from "react";
import cx from "classnames";
import styled from "styled-components";

const DURATION = 300;

const Container = styled.div`
  max-height: ${props => props.maxHeight || "none"};
`;

const FadeIn = styled.div`
  top: calc(100% + 0.3rem);
  transform-origin: center top;

  &.fade-enter {
    opacity: 0.01;
    transform: scale(0.75);
  }

  &.fade-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: all ${DURATION}ms ease;
  }

  &.fade-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.fade-exit-active {
    opacity: 0.01;
    transform: scale(0.75);
    transition: all ${DURATION}ms ease;
  }
`;

class Dropdown extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    error: PropTypes.bool,
    maxHeight: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    target: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  };

  static defaultProps = {
    error: false,
    maxHeight: "none",
    onClose: null,
    open: false,
    target: null
  };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.open) {
      return { children: nextProps.children, open: nextProps.open };
    }

    return { open: nextProps.open };
  }

  constructor(props) {
    super(props);

    this.state = {
      children: props.children,
      open: props.open
    };

    this._handleClose = this._handleClose.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { open, onClose, target } = this.props;

    if (target && onClose && prevProps.open !== open) {
      if (open) {
        document.addEventListener("mousedown", this._handleClose, false);
      } else {
        document.removeEventListener("mousedown", this._handleClose, false);
      }
    }
  }

  _handleClose(event) {
    const { onClose, target } = this.props;

    if (target && target.current.contains(event.target)) {
      return;
    }

    onClose();
  }

  render() {
    const { error, maxHeight } = this.props;
    const { children, open } = this.state;

    const dropdownClasses = cx(
      "bg-white rounded z-10 overflow-hidden border " +
        "shadow-md absolute pin-x",
      {
        "border-blue-light": !error,
        "border-red": error
      }
    );

    const containerClasses = cx("overflow-x-hidden overflow-y-auto list-reset");

    return (
      <CSSTransition
        classNames="fade"
        in={open}
        mountOnEnter
        timeout={DURATION}
        unmountOnExit
      >
        <FadeIn className={dropdownClasses}>
          <Container className={containerClasses} maxHeight={maxHeight}>
            {children}
          </Container>
        </FadeIn>
      </CSSTransition>
    );
  }
}

export default Dropdown;
