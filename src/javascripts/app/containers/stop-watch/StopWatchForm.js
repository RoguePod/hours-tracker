import { Field, Form } from 'formik';
import { FormError, TextAreaField } from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class StopWatchForm extends React.Component {
  static propTypes = {
    setFieldValue: PropTypes.func.isRequired,
    status: PropTypes.string,
    submitForm: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
  }

  static defaultProps = {
    status: null
  }

  constructor(props) {
    super(props);

    this._handleProjectChange = this._handleProjectChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      submitForm, values: { description }
    } = this.props;

    if (description !== prevProps.values.description) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        submitForm();
      }, 1000);
    }
  }

  timeout = null

  _handleProjectChange(clientRef, projectRef) {
    const { setFieldValue, submitForm } = this.props;

    setFieldValue('clientRef', clientRef);
    setFieldValue('projectRef', projectRef);
    setTimeout(submitForm, 1);
  }

  render() {
    const { status } = this.props;

    return (
      <Form
        noValidate
      >
        <FormError error={status} />
        <div className="mb-2">
          <Field
            component={ProjectField}
            label="Project"
            name="projectName"
            nameClient="clientRef"
            nameProject="projectRef"
            onProjectChange={this._handleProjectChange}
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
