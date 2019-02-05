/* global addResizeListener,removeResizeListener */

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import _isElement from 'lodash/isElement';
import styled from 'styled-components';

const Container = styled.div`
  height: 0;
  overflow-y: hidden;
  transition-property: all;
  transition-timing-function: ease;
`;

class Collapse extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    duration: PropTypes.number,
    open: PropTypes.bool
  }

  static defaultProps = {
    duration: 250,
    open: false
  }

  constructor(props) {
    super(props);

    this._handleUpdateHeight = this._handleUpdateHeight.bind(this);
    this._findElement = this._findElement.bind(this);
  }

  state = {
    height: 0
  }

  componentDidMount() {
    const { open } = this.props;

    if (open) {
      this._handleUpdateHeight();
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { open } = this.props;

    if (!prevProps.open && open) {
      this._handleUpdateHeight();
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
  }

  timeout = null

  _handleUpdateHeight() {
    const { open } = this.props;
    const { height: currentHeight } = this.state;

    if (!this._element) {
      return;
    }

    const height = currentHeight === 0 || open ? this._element.offsetHeight : 0;

    if (currentHeight !== height) {
      this.setState({ height });
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
    const { height } = this.state;

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

    return (
      <Container
        style={{ height, transitionDuration: `${duration}ms` }}
      >
        {trigger}
      </Container>
    );
  }
}

export default Collapse;
