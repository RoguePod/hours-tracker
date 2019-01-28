import { CSSTransition } from 'react-transition-group';
import Collapse from './Collapse';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import cx from 'classnames';
import styled from 'styled-components';

const DURATION = 300;

const Container =  styled.div`
  max-height: 100px;
`;

const FadeIn = styled.div`
  top: 100%;

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
    open: PropTypes.bool
  }

  static defaultProps = {
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
    const { open } = this.props;
    const { children, slide } = this.state;

    const dropdownClasses = cx(
      'bg-white border-blue rounded-b shadow-md z-10 ' +
      'overflow-x-hidden overflow-y-auto list-reset',
      {
        'border-b border-l border-r': children.length > 0
      }
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
            <Container
              className={dropdownClasses}
            >
              {children}
            </Container>
          </Collapse>
        </FadeIn>
      </CSSTransition>
    );
  }
}

export default Dropdown;
