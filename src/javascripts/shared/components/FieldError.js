import PropTypes from 'javascripts/prop-types';
import React from 'react';
import posed from 'react-pose';

const FadeIn = posed.div({
  hide: { height: 0, opacity: 0 },
  show: { height: 'auto', opacity: 1 }
});

const FieldError = ({ touched, error }) => {
  return (
    <FadeIn
      className="text-red text-sm"
      pose={touched && error ? 'show' : 'hide'}
    >
      {error &&
        <div className="pt-1">
          {error}
        </div>}
    </FadeIn>
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
