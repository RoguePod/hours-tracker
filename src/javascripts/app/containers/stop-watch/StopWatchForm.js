import { Field, Form } from 'formik';
import { FormError, TextAreaField } from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const StopWatchForm = ({ onAutoSave, status, values }) => {
  const timer = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const _handleAutoSave = () => {
    if (onAutoSave) {
      onAutoSave(values);
    }
  };

  const _handleDescriptionChange = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(_handleAutoSave, 1000);
  };

  return (
    <Form noValidate>
      <FormError error={status} />
      <div className="mb-2">
        <Field
          component={ProjectField}
          label="Project"
          name="projectId"
          onChange={_handleAutoSave}
        />
      </div>
      <Field
        autoHeight
        component={TextAreaField}
        label="Description"
        name="description"
        onChange={_handleDescriptionChange}
        rows={1}
      />
    </Form>
  );
};

StopWatchForm.propTypes = {
  onAutoSave: PropTypes.func,
  status: PropTypes.string,
  values: PropTypes.shape({
    description: PropTypes.string,
    projectId: PropTypes.string
  }).isRequired
};

StopWatchForm.defaultProps = {
  onAutoSave: null,
  status: null
};

export default StopWatchForm;
