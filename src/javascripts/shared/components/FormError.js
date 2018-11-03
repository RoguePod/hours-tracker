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
  error: PropTypes.node
};

FormError.defaultProps = {
  error: null
};

export default FormError;
