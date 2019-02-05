import { CSSTransition } from 'react-transition-group';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';

const DURATION = 300;

const Container = styled.div`
  max-height: 300px;
`;

const FadeIn = styled.div`
  top: calc(100% + 5px);
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
    transform: scale(1);
    opacity: 1;
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
    open: PropTypes.bool
  }

  static defaultProps = {
    error: false,
    open: false
  }

  constructor(props) {
    super(props);

    this.state = {
      children: props.children,
      open: props.open
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.open) {
      return { children: nextProps.children, open: nextProps.open };
    }

    return { open: nextProps.open };
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const { error } = this.props;
    const { children, open } = this.state;

    const dropdownClasses = cx(
      'bg-white rounded z-10 overflow-hidden border ' +
      'shadow-md absolute pin-x',
      {
        'border-blue-light': !error,
        'border-red': error
      }
    );

    const containerClasses = cx(
      'overflow-x-hidden overflow-y-auto list-reset'
    );

    const noResultsClasses = 'px-3 py-2 text-center font-bold text-sm';

    return (
      <CSSTransition
        classNames="fade"
        in={open}
        mountOnEnter
        timeout={DURATION}
        unmountOnExit
      >
        <FadeIn className={dropdownClasses}>
          <Container className={containerClasses}>
            {children.length === 0 &&
              <div className={noResultsClasses}>
                {'No Results Found'}
              </div>}
            {children.length > 0 && children}
          </Container>
        </FadeIn>
      </CSSTransition>
    );
  }
}

export default Dropdown;
