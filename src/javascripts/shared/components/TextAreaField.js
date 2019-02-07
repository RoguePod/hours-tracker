/* global window */

import { FieldError, Label } from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _sum from 'lodash/sum';
import _uniqueId from 'lodash/uniqueId';
import cx from 'classnames';
import styled from 'styled-components';

const TextArea = styled.textarea`
  &:disabled {
    background-color: #dae1e7;
  }
`;

class TextAreaField extends React.Component {
  static propTypes = {
    autoHeight: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool
  }

  static defaultProps = {
    autoHeight: false,
    className: null,
    disabled: false,
    id: null,
    label: null,
    onChange: null,
    required: false
  }

  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      id: props.id || _uniqueId('input_')
    };

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
    const { autoHeight, field: { value }, id } = this.props;

    // removed autoHeight
    if (!autoHeight && prevProps.autoHeight) {
      this._removeAutoHeightStyles();
    }

    // added autoHeight or value changed
    if ((autoHeight && !prevProps.autoHeight) ||
        (prevProps.field.value !== value)) {
      this._updateHeight();
    }

    if (id !== prevProps.id) {
      if (id) {
        this.setState({ id });
      } else if (!id && prevProps.id) {
        this.setState({ id: _uniqueId('input_') });
      }
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
    const { field, onChange } = this.props;

    field.onChange(event);
    this._updateHeight();

    if (onChange) {
      setTimeout(() => onChange(event.target.value), 0);
    }
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      autoHeight, className, disabled, field,
      form: { errors, isSubmitting, touched }, label, required, ...rest
    } = this.props;
    const { id } = this.state;
    /* eslint-enable no-unused-vars */

    const hasError = errors[field.name] && touched[field.name];

    const textAreaClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !hasError,
        'border-red': hasError,
        'focus:border-blue-light': !hasError,
        'focus:border-red': hasError
      },
      className
    );

    return (
      <>
        {label &&
          <Label
            error={hasError}
            htmlFor={id}
            required={required}
          >
            {label}
          </Label>}
        <TextArea
          {...field}
          {...rest}
          className={textAreaClassName}
          disabled={disabled || isSubmitting}
          id={id}
          onChange={this._handleChange}
          ref={this.ref}
        />
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
      </>
    );
  }
}

export default TextAreaField;
