import FieldHelper from "./FieldHelper";
import PropTypes from "javascripts/prop-types";
import React from "react";

const FieldError = ({ touched, error }) => {
  return (
    <FieldHelper
      className="text-red"
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
