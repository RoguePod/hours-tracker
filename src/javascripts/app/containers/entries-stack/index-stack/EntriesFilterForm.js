import {
  Button,
  DateField,
  FormError
} from 'javascripts/shared/components';
import {
  ClientField,
  ProjectField,
  UserField
} from 'javascripts/app/components';
import { Field, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

class EntriesFilterForm extends React.Component {
  static propTypes = {
    onClear: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    showAdmin: PropTypes.bool.isRequired,
    status: PropTypes.string
  }

  static defaultProps = {
    status: null
  }

  constructor(props) {
    super(props);

    this._handleClientChange = this._handleClientChange.bind(this);
    this._handleUserChange = this._handleUserChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleClientChange(clientRef) {
    const { setFieldValue } = this.props;

    setFieldValue('clientRef', clientRef);
  }

  _handleUserChange(userRef) {
    const { setFieldValue } = this.props;

    setFieldValue('userRef', userRef);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const { onClear, showAdmin, status } = this.props;

    return (
      <Form
        noValidate
      >
        <FormError error={status} />
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={DateField}
              label="Start Date"
              name="startDate"
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={DateField}
              label="End Date"
              name="endDate"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={ClientField}
              label="Client"
              name="clientName"
              nameClient="clientRef"
              onClientChange={this._handleClientChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              clientField="clientRef"
              component={ProjectField}
              label="Project"
              name="projectRef"
            />
          </div>
        </div>
        {showAdmin &&
          <div className="mb-4">
            <Field
              component={UserField}
              label="User"
              name="userName"
              nameUser="userRef"
              onUserChange={this._handleUserChange}
            />
          </div>}
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 md:mb-0 mb-4">
            <Button
              className="py-2 w-full"
              color="green"
              type="submit"
            >
              {'Filter'}
            </Button>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <Button
              className="py-2 w-full"
              onClick={onClear}
              type="button"
            >
              {'Clear'}
            </Button>
          </div>
        </div>
      </Form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default EntriesFilterForm;
