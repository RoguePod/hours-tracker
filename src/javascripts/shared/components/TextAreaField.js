import { FieldError, Label } from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _sum from 'lodash/sum';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';
import { useId } from 'javascripts/shared/hooks';

const TextArea = styled.textarea`
  transition: border 300ms ease;
`;

const TextAreaField = (props) => {
  const {
    autoHeight,
    className,
    disabled,
    field,
    form,
    label,
    onChange,
    required,
    ...rest
  } = props;

  const { errors, isSubmitting } = form;

  const textAreaRef = React.useRef(null);
  const id = useId(rest.id);

  React.useEffect(() => {
    if (onChange) {
      onChange(field.value);
    }

    if (!textAreaRef.current) {
      return;
    }

    if (!autoHeight) {
      textAreaRef.current.style.height = null;
      textAreaRef.current.style.resize = null;
      return;
    }

    const {
      borderBottomWidth,
      borderTopWidth,
      minHeight
    } = window.getComputedStyle(textAreaRef.current);

    const borderHeight = _sum(
      [borderBottomWidth, borderTopWidth].map((x) => parseFloat(x))
    );

    // Measure the scrollHeight and update the height to match.
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.overflowY = 'hidden';
    textAreaRef.current.style.height = `${Math.max(
      parseFloat(minHeight),
      Math.ceil(textAreaRef.current.scrollHeight + borderHeight)
    )}px`;
    textAreaRef.current.style.overflowY = '';
  }, [autoHeight, field.value, onChange]);

  const error = _get(errors, field.name);
  const touched = _get(form.touched, field.name);
  const hasError = error && touched;

  const textAreaClassName = cx(
    'appearance-none border rounded w-full py-2 px-3 text-gray-800',
    'leading-tight focus:outline-none disabled:bg-gray-300',
    'disabled:cursor-not-allowed',
    {
      'border-gray-400 focus:shadow-outline focus:border-teal-500': !hasError,
      'border-red-500 focus:shadow-outline-error focus:border-red-500': hasError
    },
    className
  );

  return (
    <>
      {!isBlank(label) && (
        <Label error={hasError} htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <TextArea
        autoCapitalize="sentences"
        autoCorrect="on"
        {...field}
        {...rest}
        className={textAreaClassName}
        disabled={disabled || isSubmitting}
        id={id}
        ref={textAreaRef}
      />
      <FieldError error={error} touched={touched} />
    </>
  );
};

TextAreaField.propTypes = {
  autoHeight: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  field: PropTypes.formikField.isRequired,
  form: PropTypes.formikForm.isRequired,
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
