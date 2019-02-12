import { Field, Form } from 'formik';
import { FormError, TextAreaField } from 'javascripts/shared/components';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class StopWatchForm extends React.Component {
  static propTypes = {
    onAutoSave: PropTypes.func,
    status: PropTypes.string,
    values: PropTypes.object.isRequired
  }

  static defaultProps = {
    onAutoSave: null,
    status: null
  }

  constructor(props) {
    super(props);

    this._handleDescriptionChange = this._handleDescriptionChange.bind(this);
    this._handleAutoSave = this._handleAutoSave.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  timeout = null

  _handleDescriptionChange() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(this._handleAutoSave, 1000);
  }

  _handleAutoSave() {
    const { onAutoSave, values } = this.props;

    if (onAutoSave) {
      onAutoSave(values);
    }
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
            clientField="clientId"
            component={ProjectField}
            label="Project"
            name="projectId"
            onChange={this._handleAutoSave}
          />
        </div>
        <Field
          autoHeight
          component={TextAreaField}
          label="Description"
          name="description"
          onChange={this._handleDescriptionChange}
          rows={1}
        />
      </Form>
    );
  }
}

export default StopWatchForm;
