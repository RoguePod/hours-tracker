import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';
import useId from 'javascripts/shared/hooks/useId';

const Input = styled.input`
  transition: border 300ms ease;

  &:disabled {
    background-color: #dae1e7;
    cursor: not-allowed;
  }
`;

const InputBase = ({ className, error, label, required, ...rest }) => {
  const id = useId(rest.id);

  const inputClassName = cx(
    'appearance-none border rounded w-full py-2 px-3 text-gray-700',
    'leading-tight focus:outline-none',
    {
      'border-gray-400': !error,
      'border-red-500': error,
      'focus:border-blue-400': !error,
      'focus:border-red-500': error
    },
    className
  );

  return (
    <>
      {!isBlank(label) && (
        <Label error={error} htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Input {...rest} className={inputClassName} id={id} />
    </>
  );
};

InputBase.propTypes = {
  className: PropTypes.string,
  error: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
};

InputBase.defaultProps = {
  className: null,
  error: false,
  id: null,
  label: null,
  required: false,
  type: 'text'
};

export default InputBase;
