/* global window */

import { FieldError, Label } from 'javascripts/shared/components';
import React, { useEffect, useRef } from 'react';

import PropTypes from 'javascripts/prop-types';
import _sum from 'lodash/sum';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';
import useId from 'javascripts/shared/hooks/useId';

const TextArea = styled.textarea`
  &:disabled {
    background-color: #dae1e7;
    cursor: not-allowed;
  }
`;

/* eslint-disable max-statements, max-lines-per-function, react/jsx-no-bind */
const TextAreaField = (props) => {
  /* eslint-disable no-unused-vars */
  const {
    autoHeight, className, disabled, field,
    form: { errors, isSubmitting, touched }, label, onChange, required, ...rest
  } = props;
  /* eslint-enable no-unused-vars */

  const textAreaRef = useRef(null);
  const id = useId(rest.id);

  const _removeAutoHeightStyles = () => {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = null;
      textAreaRef.current.style.resize = null;
    }
  };

  const _updateHeight = () => {
    if (!textAreaRef || !textAreaRef.current || !autoHeight) {
      return;
    }

    const {
      borderBottomWidth, borderTopWidth, minHeight
    } = window.getComputedStyle(textAreaRef.current);

    /* eslint-disable id-length */
    const borderHeight =
      _sum([borderBottomWidth, borderTopWidth].map((x) => parseFloat(x)));
    /* eslint-enable id-length */

    // Measure the scrollHeight and update the height to match.
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.overflowY = 'hidden';
    textAreaRef.current.style.height = `${Math.max(
      parseFloat(minHeight),
      Math.ceil(textAreaRef.current.scrollHeight + borderHeight)
    )}px`;
    textAreaRef.current.style.overflowY = '';
  };

  const handleChange = (event) => {
    field.onChange(event);
    _updateHeight();

    if (onChange) {
      setTimeout(() => onChange(event.target.value), 0);
    }
  };

  useEffect(() => {
    if (autoHeight) {
      _updateHeight();
    } else {
      _removeAutoHeightStyles();
    }
  }, [autoHeight, field.value]);

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
      {!isBlank(label) &&
        <Label
          error={hasError}
          htmlFor={id}
          required={required}
        >
          {label}
        </Label>}
      <TextArea
        autoCapitalize="sentences"
        autoCorrect="on"
        {...field}
        {...rest}
        className={textAreaClassName}
        disabled={disabled || isSubmitting}
        id={id}
        onChange={handleChange}
        ref={textAreaRef}
      />
      <FieldError
        error={errors[field.name]}
        touched={touched[field.name]}
      />
    </>
  );
};

TextAreaField.propTypes = {
  autoHeight: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  field: PropTypes.field.isRequired,
  form: PropTypes.form.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool
};

TextAreaField.defaultProps = {
  autoHeight: false,
  className: null,
  disabled: false,
  label: null,
  onChange: null,
  required: false
};

export default TextAreaField;
