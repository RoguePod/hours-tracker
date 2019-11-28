import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const SubmitButton = ({
  children,
  disabled,
  submitting,
  submittingText,
  ...rest
}) => {
  return (
    <Button {...rest} disabled={disabled || submitting} type="submit">
      {submitting && (
        <>
          <FontAwesomeIcon icon="spinner" spin /> {submittingText}
        </>
      )}
      {!submitting && children}
    </Button>
  );
};

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  submitting: PropTypes.bool,
  submittingText: PropTypes.string
};

SubmitButton.defaultProps = {
  disabled: false,
  submitting: false,
  submittingText: null
};

export default React.memo(SubmitButton);
