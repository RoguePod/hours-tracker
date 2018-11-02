import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FormError = ({ error }) => {
  if (error) {
    return (
      <div className="text-red">
        {error}
      </div>
    );
  }

  return null;
};

FormError.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  error: PropTypes.any
  /* eslint-enable react/forbid-prop-types */
};

FormError.defaultProps = {
  error: null
};

export default FormError;
