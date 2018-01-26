import { Label } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FieldError = ({ touched, error }) => {
  if (touched && error) {
    return (
      <Label
        color="red"
        pointing
      >
        {error}
      </Label>
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
