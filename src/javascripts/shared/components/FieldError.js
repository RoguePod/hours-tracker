import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FieldError = ({ touched, error }) => {
  if (touched && error) {
    return (
      <div className="text-red text-sm">
        {error}
      </div>
    );
  }

  return null;
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
