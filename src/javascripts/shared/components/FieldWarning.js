import PropTypes from 'javascripts/prop-types';
import React from 'react';
import posed from 'react-pose';

const FadeIn = posed.div({
  hide: { height: 0, opacity: 0 },
  show: { height: 'auto', opacity: 1 }
});

const FieldError = ({ touched, warning }) => {
  return (
    <FadeIn
      className="text-yellow-darker text-sm"
      pose={touched && warning ? 'show' : 'hide'}
    >
      {warning &&
        <div className="pt-1">
          {warning}
        </div>}
    </FadeIn>
  );
};

FieldError.propTypes = {
  touched: PropTypes.bool,
  warning: PropTypes.string
};

FieldError.defaultProps = {
  touched: false,
  warning: null
};

export default FieldError;
