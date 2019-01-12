import { FieldError, Label } from 'javascripts/shared/components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import cx from 'classnames';

const SelectField = (props) => {
  const { children, className, label, id, input, meta, ...rest } = props;

  /* eslint-disable no-unneeded-ternary */
  const isError = meta.touched && meta.error ? true : false;
  /* eslint-enable no-unneeded-ternary */

  const inputClassName = cx(
    'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
    'leading-tight focus:outline-none bg-white cursor-pointer h-full ' +
    'transition',
    {
      'border-grey-light': !isError,
      'border-red': isError,
      'focus:border-blue-light': !isError,
      'focus:border-red': isError
    },
    className
  );

  const arrowClasses =
    'pointer-events-none absolute pin-y pin-r flex items-center px-4';

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

      <div className="relative">
        <select
          {...input}
          {...rest}
          className={inputClassName}
          id={inputId}
        >
          {children}
        </select>
        <div className={arrowClasses}>
          <FontAwesomeIcon
            icon="caret-down"
          />
        </div>
      </div>
      <FieldError
        error={meta.error}
        touched={meta.touched}
      />
    </>
  );
};

SelectField.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    errpr: PropTypes.string,
    touched: PropTypes.bool
  }).isRequired
};

SelectField.defaultProps = {
  children: null,
  className: null,
  id: null,
  label: null
};

export default SelectField;
