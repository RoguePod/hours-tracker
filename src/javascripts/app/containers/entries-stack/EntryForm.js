import {
  Button,
  FormError,
  TextAreaField,
  TimeField,
  TimezoneField
} from 'javascripts/shared/components';
import { Field, Form } from 'formik';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class EntryForm extends React.Component {
  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    status: PropTypes.string,
    values: PropTypes.shape({
      timezone: PropTypes.string.isRequired
    }).isRequired
  }

  static defaultProps = {
    status: null
  }

  constructor(props) {
    super(props);

    this._handleProjectChange = this._handleProjectChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleProjectChange(clientRef, projectRef) {
    const { setFieldValue } = this.props;

    setFieldValue('clientRef', clientRef);
    setFieldValue('projectRef', projectRef);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const { isSubmitting, status, values: { timezone } } = this.props;

    return (
      <Form
        noValidate
      >
        <FormError error={status} />
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              autoFocus
              component={TimeField}
              label="Started"
              name="startedAtText"
              nameField="startedAt"
              timezone={timezone}
              type="text"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              component={TimeField}
              label="Stopped"
              name="stoppedAtText"
              nameField="stoppedAt"
              timezone={timezone}
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={ProjectField}
              label="Project"
              name="projectName"
              nameClient="clientRef"
              nameProject="projectRef"
              onProjectChange={this._handleProjectChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={TimezoneField}
              label="Timezone"
              name="timezone"
            />
          </div>
        </div>
        <div className="mb-4">
          <Field
            autoCapitalize="sentences"
            autoCorrect="on"
            autoHeight
            component={TextAreaField}
            label="Description"
            name="description"
            rows={1}
          />
        </div>
        <Button
          className="py-2"
          color="green"
          disabled={isSubmitting}
          loading={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </Form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default EntryForm;
