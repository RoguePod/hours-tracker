import { Icon, Portal, Segment } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styles from './Flash.scss';

class Flash extends React.Component {
  static propTypes = {
    flash: PropTypes.flash.isRequired,
    onRemoveFlash: PropTypes.func.isRequired,
    /* eslint-disable react/forbid-prop-types */
    style: PropTypes.object
    /* eslint-enable react/forbid-prop-types */
  }

  static defaultProps = {
    style: null
  }

  constructor(props) {
    super(props);

    this._handleRemove = this._handleRemove.bind(this);
    this._handleRef = this._handleRef.bind(this);
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this._handleRemove();
    }, 3000);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  elementHeight = 0

  timeout = null

  index() {
    const { flash } = this.props;

    return flash.index;
  }

  height() {
    return this.elementHeight;
  }

  _handleRef(element) {
    if (element) {
      this.elementHeight = parseInt(element.offsetHeight, 10);
    } else {
      this.elementHeight = 0;
    }
  }

  _handleRemove() {
    const { onRemoveFlash, flash: { id } } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    onRemoveFlash(id);
  }

  render() {
    const { flash, style } = this.props;

    const flashStyle = Object.assign({}, style);
    const translateX = flashStyle.translateX || 0;
    const translateY = flashStyle.translateY || 0;

    flashStyle.transform = `translate(${translateX}px, ${translateY}px)`;
    flashStyle.zIndex = 100001;

    return (
      <Portal
        open
      >
        <div
          className={styles.container}
          ref={this._handleRef}
          style={flashStyle}
        >
          <Segment
            clearing
            color={flash.color}
            inverted
            raised
          >
            <div className={styles.icon}>
              <Icon
                name="close"
                onClick={this._handleRemove}
              />
            </div>
            <div className={styles.message}>
              {flash.message}
            </div>
          </Segment>
        </div>
      </Portal>
    );
  }
}

export default Flash;
