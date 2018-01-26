import { TransitionMotion, spring } from 'react-motion';

import Flash from './Flash';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _filter from 'lodash/filter';
import _keys from 'lodash/keys';

class Flashes extends React.Component {
  static propTypes = {
    flashes: PropTypes.arrayOf(PropTypes.flash).isRequired,
    onRemoveFlash: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this._willEnter = this._willEnter.bind(this);
    this._willLeave = this._willLeave.bind(this);
    this._handleRef = this._handleRef.bind(this);
    this._flashHeight = this._flashHeight.bind(this);
  }

  state = {
    heights: {}
  }

  translateX = 30

  gap = 15

  _willLeave(flash) {
    return {
      ...flash.styles,
      opacity: spring(0),
      translateX: spring(this.translateX),
      translateY: spring(this._flashHeight(flash.data.index))
    };
  }

  _willEnter(flash) {
    return {
      ...flash.styles,
      opacity: 0,
      translateX: this.translateX * -1,
      translateY: this._flashHeight(flash.data.index)
    };
  }

  _flashHeight(index) {
    const { heights } = this.state;

    const indices = _filter(_keys(heights), (idx) => {
      return parseInt(idx, 10) < parseInt(index, 10);
    });

    let height = 0;

    for (const key in indices) {
      if ({}.hasOwnProperty.call(indices, key) && heights[key]) {
        height += heights[key] + this.gap;
      }
    }

    return height * -1;
  }

  _handleRef(element) {
    if (!element) {
      return;
    }

    this.setState(({ heights }) => {
      heights[element.index()] = element.height();

      return {
        heights
      };
    });
  }

  render() {
    const { flashes, onRemoveFlash } = this.props;

    const flashesStyles = flashes.map((flash, index) => {
      return {
        data: { ...flash, index },
        key: String(flash.id),
        style: {
          opacity: spring(1),
          translateX: spring(0),
          translateY: spring(this._flashHeight(index))
        }
      };
    });

    return (
      <TransitionMotion
        styles={flashesStyles}
        willEnter={this._willEnter}
        willLeave={this._willLeave}
      >
        {(interpolatedStyles) => {
          return (
            <div>
              {interpolatedStyles.map((config) => {
                return (
                  <Flash
                    flash={config.data}
                    key={config.key}
                    onRemoveFlash={onRemoveFlash}
                    ref={this._handleRef}
                    style={config.style}
                  />
                );
              })}
            </div>
          );
        }}
      </TransitionMotion>
    );
  }
}

export default Flashes;
