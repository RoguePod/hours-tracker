import { CSSTransition } from 'react-transition-group';
import Collapse from './Collapse';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import styled from 'styled-components';

const DURATION = 300;

const Container = styled.div`
  max-height: 300px;
`;

const Spacer = styled.div`
  height: 4px;
`;

const FadeIn = styled.div`
  top: calc(100% - 5px);

  &.fade-enter {
    opacity: 0.5;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: opacity ${DURATION}ms ease;
  }

  &.fade-exit {
    opacity: 1;
  }

  &.fade-exit-active {
    opacity: 0.5;
    transition: opacity ${DURATION}ms ease;
  }
`;

class Dropdown extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    error: PropTypes.bool,
    focused: PropTypes.bool,
    open: PropTypes.bool
  }

  static defaultProps = {
    error: false,
    focused: false,
    open: false
  }

  constructor(props) {
    super(props);

    this.state = {
      children: props.children.map((child) => React.cloneElement(child)),
      prevChildren: props.children,
      slide: props.open
    };

    this._handleEnter = this._handleEnter.bind(this);
    this._handleExit = this._handleExit.bind(this);

    // setTimeout(() => { debugger; }, 2000);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(nextProps) {
    const { prevChildren } = this.state;

    if (nextProps.open && !_isEqual(nextProps.children, prevChildren)) {
      this.setState({
        children: nextProps.children.map((child) => React.cloneElement(child)),
        prevChildren: nextProps.children
      });
    }
  }

  _handleEnter() {
    this.setState({ slide: true });
  }

  _handleExit() {
    this.setState({ slide: false });
  }

  render() {
    const { error, focused, open } = this.props;
    const { children, slide } = this.state;

    const dropdownClasses = cx(
      'bg-white rounded-b z-10 overflow-hidden border-l border-b border-r ' +
      'shadow-md',
      {
        'border-blue-light': !error && focused,
        'border-grey-light': !error && focused,
        'border-red': error
      }
    );

    const containerClasses = cx(
      'overflow-x-hidden overflow-y-auto list-reset'
    );

    return (
      <CSSTransition
        classNames="fade"
        in={open}
        mountOnEnter
        onEnter={this._handleEnter}
        onExit={this._handleExit}
        timeout={DURATION}
        unmountOnExit
      >
        <FadeIn className="absolute pin-x">
          <Collapse
            duration={DURATION}
            open={slide}
          >
            <div
              className={dropdownClasses}
            >
              <Spacer className="transition" />
              <Container className={containerClasses}>
                {children}
              </Container>
            </div>
          </Collapse>
        </FadeIn>
      </CSSTransition>
    );
  }
}

export default Dropdown;
