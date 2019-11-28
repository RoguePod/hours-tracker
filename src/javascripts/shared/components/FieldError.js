import FieldHelper from './FieldHelper';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FieldError = ({ error, touched }) => {
  return (
    <FieldHelper
      className="text-red-500"
      message={error}
      open={Boolean(touched && error)}
    />
  );
};

FieldError.propTypes = {
  error: PropTypes.string,
  touched: PropTypes.bool
};

FieldError.defaultProps = {
  error: null,
  touched: false
};

export default FieldError;
