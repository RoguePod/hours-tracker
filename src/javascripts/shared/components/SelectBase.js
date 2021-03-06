import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';
import useId from 'javascripts/shared/hooks/useId';

const Select = styled.select`
  transition: border 300ms ease;

  &::selection {
    background: yellow;
  }

  &:disabled {
    background-color: #dae1e7;
    cursor: not-allowed;
  }
`;

const SelectBase = (props) => {
  const { children, className, error, label, required, ...rest } = props;
  const id = useId(rest.id);

  const inputClassName = cx(
    'appearance-none border rounded w-full py-2 px-3 text-gray-700',
    'leading-tight focus:outline-none bg-white cursor-pointer h-full',
    {
      'border-gray-400': !error,
      'border-red-500': error,
      'focus:border-blue-400': !error,
      'focus:border-red-500': error
    },
    className
  );

  const arrowClasses =
    'pointer-events-none absolute inset-y-0 right-0 flex items-center px-4';

  return (
    <>
      {!isBlank(label) && (
        <Label error={error} htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        <Select {...rest} className={inputClassName} id={id}>
          {children}
        </Select>
        <div className={arrowClasses}>
          <FontAwesomeIcon icon="caret-down" />
        </div>
      </div>
    </>
  );
};

SelectBase.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  error: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool
};

SelectBase.defaultProps = {
  children: null,
  className: null,
  error: false,
  id: null,
  label: null,
  required: false
};

export default SelectBase;
