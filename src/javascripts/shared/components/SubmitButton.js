import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const SubmitButton = ({ children, submitting, submittingText, ...rest }) => {
  return (
    <Button
      {...rest}
      disabled={submitting}
      type="submit"
    >
      {submitting &&
        <div className="inline-block pr-3">
          <FontAwesomeIcon
            icon="spinner"
            spin
          />
        </div>}
      {submitting && submittingText ? submittingText : children}
    </Button>
  );
};

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  submitting: PropTypes.bool,
  submittingText: PropTypes.string
};

SubmitButton.defaultProps = {
  className: 'py-2',
  color: 'green',
  submitting: false,
  submittingText: 'Saving...'
};

export default SubmitButton;
