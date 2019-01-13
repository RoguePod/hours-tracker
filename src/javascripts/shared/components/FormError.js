import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { isBlank } from 'javascripts/globals';

const FormError = ({ error }) => {
  if (!isBlank(error)) {
    const alertClasses =
      'bg-red-lightest border-t-4 border-red rounded text-red-darkest ' +
      'px-4 py-3 shadow-md flex items-center mb-4';

    return (
      <div
        className={alertClasses}
        role="alert"
      >
        <FontAwesomeIcon
          icon="exclamation-circle"
          size="2x"
        />
        <div className="pl-4">
          {error}
        </div>
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
