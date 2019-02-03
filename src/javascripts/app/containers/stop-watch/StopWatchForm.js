import { Field, Form } from 'formik';
import { FormError, TextAreaField } from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class StopWatchForm extends React.Component {
  static propTypes = {
    status: PropTypes.string,
    submitForm: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
  }

  static defaultProps = {
    status: null
  }

  componentDidUpdate(prevProps) {
    const {
      submitForm, values: { clientRef, description, projectRef }
    } = this.props;

    if (description !== prevProps.values.description) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        submitForm();
      }, 1000);
    } else if (clientRef !== prevProps.values.clientRef ||
               projectRef !== prevProps.values.projectRef) {
      submitForm();
    }
  }

  timeout = null

  render() {
    const { status } = this.props;

    return (
      <Form
        noValidate
      >
        <FormError error={status} />
        <div className="mb-2">
          <Field
            clientField="clientRef"
            component={ProjectField}
            label="Project"
            name="projectRef"
          />
        </div>
        <Field
          autoCapitalize="sentences"
          autoCorrect="on"
          autoHeight
          component={TextAreaField}
          label="Description"
          name="description"
          rows={1}
        />
      </Form>
    );
  }
}

export default StopWatchForm;
