import { Label } from 'semantic-ui-react';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const FieldWarning = ({ touched, warning }) => {
  if (touched && warning) {
    return (
      <Label
        color="green"
        pointing
      >
        {warning}
      </Label>
    );
  }

  return null;
};

FieldWarning.propTypes = {
  touched: PropTypes.bool,
  warning: PropTypes.string
};

FieldWarning.defaultProps = {
  touched: false,
  warning: null
};

export default FieldWarning;
