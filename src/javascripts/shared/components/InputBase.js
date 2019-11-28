import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';
import { useId } from 'javascripts/shared/hooks';

const Input = styled.input`
  transition: border 300ms ease;
`;

const InputBase = React.forwardRef(
  ({ className, error, help, label, required, tag, ...rest }, ref) => {
    const id = useId(rest.id);

    const inputClassName = cx(
      'appearance-none bg-white border rounded w-full text-gray-800',
      'focus:outline-none disabled:bg-gray-300 leading-tight',
      'py-2 px-3 disabled:cursor-not-allowed',
      {
        'border-gray-400 focus:shadow-outline focus:border-teal-500': !error,
        'border-red-500 focus:shadow-outline-error focus:border-red-500': error,
        'placeholder-gray-400': !error,
        'placeholder-red-400': error
      },
      className
    );

    const Tag = tag || Input;

    return (
      <>
        {!isBlank(label) && (
          <Label error={error} help={help} htmlFor={id} required={required}>
            {label}
          </Label>
        )}
        <Tag {...rest} className={inputClassName} id={id} ref={ref} />
      </>
    );
  }
);

InputBase.propTypes = {
  className: PropTypes.string,
  error: PropTypes.bool,
  help: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  tag: PropTypes.any,
  type: PropTypes.string
};

InputBase.defaultProps = {
  className: null,
  error: false,
  help: null,
  id: null,
  label: null,
  required: false,
  tag: null,
  type: 'text'
};

export default InputBase;
