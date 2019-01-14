import { Field, Form } from 'formik';
import { FormError, TextAreaField } from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class RunningForm extends React.Component {
  static propTypes = {
    onUpdateEntry: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    status: PropTypes.string,
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
      onUpdateEntry, values: { clientRef, description, projectRef }
    } = this.props;

    if (description !== prevProps.values.description) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        onUpdateEntry({ description });
      }, 1000);
    }

    if (clientRef !== prevProps.values.clientRef ||
        projectRef !== prevProps.values.projectRef) {
      onUpdateEntry({ clientRef, projectRef });
    }
  }

  timeout = null

  _handleProjectChange(clientRef, projectRef) {
    const { setFieldValue } = this.props;

    setFieldValue('clientRef', clientRef);
    setFieldValue('projectRef', projectRef);
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

export default RunningForm;
