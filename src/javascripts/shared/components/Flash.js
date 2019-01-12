/* global window */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _isEqual from 'lodash/isEqual';
import _isNumber from 'lodash/isNumber';
import styled from 'styled-components';

const duration = 3000;

const Container = styled.div`
  top: 100%;
`;

class Flash extends React.Component {
  static propTypes = {
    flash: PropTypes.flash.isRequired,
    onRemoveFlash: PropTypes.func.isRequired,
    onUpdateFlash: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this._handleRemove = this._handleRemove.bind(this);
    this._handleResize = this._handleResize.bind(this);

    this.element = React.createRef();
  }

  componentDidMount() {
    this._handleResize();

    window.addEventListener('resize', this._handleResize);

    this.timeout = setTimeout(() => {
      this._handleRemove();
    }, duration);
  }

  shouldComponentUpdate(nextProps) {
    const { flash } = this.props;

    return (
      !_isEqual(flash, nextProps.flash)
    );
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    window.removeEventListener('resize', this._handleResize);
  }

  timeout = null

  _handleRemove() {
    const { onRemoveFlash, flash: { id } } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    onRemoveFlash(id);
  }

  _handleResize() {
    const { flash: { id }, onUpdateFlash } = this.props;

    const { height } = this.element.current.getBoundingClientRect();

    onUpdateFlash(id, { height });
  }

  render() {
    const { flash } = this.props;

    const { bottom } = flash;
    const color = flash.color || 'green';
    const icon = flash.icon || 'exclamation-circle';

    const containerClasses = 'fixed transition w-full pb-4 px-4';
    const alertClasses =
      `bg-${color}-lightest border-${color} rounded text-${color}-darkest ` +
      'border-t-4 px-4 py-3 shadow-lg flex max-w-sm mx-auto';

    const containerStyles = {};

    if (_isNumber(bottom)) {
      containerStyles.transform = `translateY(-${bottom}px)`;
    }

    return (
      <Container
        className={containerClasses}
        onClick={this._handleRemove}
        ref={this.element}
        style={containerStyles}
      >
        <div className={alertClasses}>
          <div className="p-2">
            <FontAwesomeIcon
              icon={icon}
            />
          </div>
          <div className="flex-1 self-center">
            {flash.message}
          </div>
          <div className="p-2 cursor-pointer">
            <FontAwesomeIcon
              icon="times"
            />
          </div>
        </div>
      </Container>
    );
  }
}

export default Flash;
