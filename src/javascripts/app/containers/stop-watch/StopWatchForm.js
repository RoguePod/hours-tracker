import { Field, Form } from 'formik';
import { FormError, TextAreaField } from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

const StopWatchForm = ({ onAutoSave, status, values }) => {
  const [timeout, setTimer] = React.useState(null);

  React.useEffect(() => {
    if (onAutoSave) {
      onAutoSave(values);
    }
  }, [values.projectId, values.clientId]);

  React.useEffect(() => {
    if (onAutoSave) {
      if (timeout) {
        clearTimeout(timeout);
      }

      setTimer(setTimeout(() => onAutoSave(values), 1000));
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [values.description]);

  return (
    <Form noValidate>
      <FormError error={status} />
      <div className="mb-2">
        <Field
          billableField="billable"
          clientField="clientId"
          component={ProjectField}
          label="Project"
          name="projectId"
        />
      </div>
      <Field
        autoHeight
        component={TextAreaField}
        label="Description"
        name="description"
        rows={1}
      />
    </Form>
  );
};

StopWatchForm.propTypes = {
  onAutoSave: PropTypes.func,
  status: PropTypes.string,
  values: PropTypes.shape({
    clientId: PropTypes.string,
    description: PropTypes.string,
    projectId: PropTypes.string
  }).isRequired
};

StopWatchForm.defaultProps = {
  onAutoSave: null,
  status: null
};

export default StopWatchForm;
