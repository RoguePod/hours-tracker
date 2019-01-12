/* global window */

import { FieldError, Label } from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _sum from 'lodash/sum';
import _uniqueId from 'lodash/uniqueId';
import cx from 'classnames';

class TextAreaField extends React.Component {
  static propTypes = {
    autoHeight: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
      error: PropTypes.string,
      touched: PropTypes.bool
    }).isRequired
  }

  static defaultProps = {
    autoHeight: false,
    className: null,
    id: null,
    label: null
  }

  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this._removeAutoHeightStyles = this._removeAutoHeightStyles.bind(this);
    this._updateHeight = this._updateHeight.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  componentDidMount() {
    this._updateHeight();
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { autoHeight, input: { value } } = this.props;

    // removed autoHeight
    if (!autoHeight && prevProps.autoHeight) {
      this._removeAutoHeightStyles();
    }

    // added autoHeight or value changed
    if ((autoHeight && !prevProps.autoHeight) ||
        (prevProps.input.value !== value)) {
      this._updateHeight();
    }
  }

  _removeAutoHeightStyles() {
    if (this.ref && this.ref.current) {
      this.ref.current.style.height = null;
      this.ref.current.style.resize = null;
    }
  }

  _updateHeight() {
    const { autoHeight } = this.props;

    if (!this.ref || !this.ref.current || !autoHeight) {
      return;
    }

    const {
      borderBottomWidth, borderTopWidth, minHeight
    } = window.getComputedStyle(this.ref.current);

    /* eslint-disable id-length */
    const borderHeight =
      _sum([borderBottomWidth, borderTopWidth].map((x) => parseFloat(x)));
    /* eslint-enable id-length */

    // Measure the scrollHeight and update the height to match.
    this.ref.current.style.height = 'auto';
    this.ref.current.style.overflowY = 'hidden';
    this.ref.current.style.height = `${Math.max(
      parseFloat(minHeight),
      Math.ceil(this.ref.current.scrollHeight + borderHeight)
    )}px`;
    this.ref.current.style.overflowY = '';
  }

  _handleChange(event) {
    const { input: { onChange } } = this.props;

    onChange(event);
    this._updateHeight();
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      autoHeight, className, id, input, label, meta, ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    const textAreaClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !isError,
        'border-red': isError,
        'focus:border-blue-light': !isError,
        'focus:border-red': isError
      },
      className
    );

    const inputId = id ? id : _uniqueId('input_');

    return (
      <>
        {label &&
          <Label
            error={isError}
            htmlFor={inputId}
          >
            {label}
          </Label>}
        <textarea
          {...input}
          {...rest}
          className={textAreaClassName}
          id={inputId}
          onChange={this._handleChange}
          ref={this.ref}
        />
        <FieldError
          error={meta.error}
          touched={meta.touched}
        />
      </>
    );
  }
}

export default TextAreaField;
