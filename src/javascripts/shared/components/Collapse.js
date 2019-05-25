/* global addResizeListener,removeResizeListener,document */

import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import _isElement from 'lodash/isElement';
import styled from 'styled-components';

const Container = styled.div`
  height: 0;
  transition-property: all;
  transition-timing-function: ease;
`;

class Collapse extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    duration: PropTypes.number,
    open: PropTypes.bool
  };

  static defaultProps = {
    duration: 250,
    open: false
  };

  constructor(props) {
    super(props);

    this._handleUpdateHeight = this._handleUpdateHeight.bind(this);
    this._findElement = this._findElement.bind(this);
    this._handleFocusChange = this._handleFocusChange.bind(this);
  }

  state = {
    hidden: document.hidden,
    open: false,
    overflowY: 'hidden',
    height: 0
  };

  componentDidMount() {
    const { open } = this.props;

    if (open) {
      this.setState({ open: true }, this._handleUpdateHeight);
    }

    document.addEventListener('visibilitychange', this._handleFocusChange);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    const { open } = this.props;
    const { hidden } = this.state;

    if (prevProps.open !== open || (prevState.hidden !== hidden && !hidden)) {
      if (open) {
        this.setState({ open: true }, () => this._handleUpdateHeight());
      } else {
        this._handleUpdateHeight();
      }
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this._element) {
      removeResizeListener(this._element, this._handleUpdateHeight);
    }

    document.removeEventListener('visibilitychange', this._handleFocusChange);
  }

  timeout = null;

  _handleFocusChange() {
    this.setState({ hidden: document.hidden });
  }

  _handleUpdateHeight() {
    const { duration, open } = this.props;
    const { height: currentHeight } = this.state;

    if (!this._element) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const height = open ? this._element.offsetHeight : 0;

    if (currentHeight !== height) {
      this.setState({ height, overflowY: 'hidden' });

      this.timeout = setTimeout(() => {
        this.setState({ open: false, overflowY: null });
      }, duration);
    } else {
      this.setState({ overflowY: null });
    }
  }

  _findElement(node) {
    let element = node;
    if (!_isElement(node)) {
      /* eslint-disable react/no-find-dom-node */
      element = ReactDOM.findDOMNode(node);
      /* eslint-enable react/no-find-dom-node */
    }

    if (element) {
      return element;
    }

    return null;
  }

  render() {
    const { children, duration, ...rest } = this.props;
    const { height, open: stateOpen, overflowY } = this.state;

    const child = React.Children.only(children);
    const trigger = React.cloneElement(child, {
      ...rest,
      ref: (node) => {
        this._element = this._findElement(node);

        if (this._element) {
          addResizeListener(this._element, this._handleUpdateHeight);
        }

        // Call the original ref, if any
        const { ref } = child;

        if (typeof ref === 'function') {
          ref(node);
        }
      }
    });

    const containerStyles = {
      height,
      overflowY,
      transitionDuration: `${duration}ms`
    };

    return (
      <Container style={containerStyles}>{stateOpen && trigger}</Container>
    );
  }
}

export default Collapse;
