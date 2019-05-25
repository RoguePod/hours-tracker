import { Button, DateField, FormError } from 'javascripts/shared/components';
import {
  ClientField,
  ProjectField,
  UserField
} from 'javascripts/app/components';
import { Field, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

const EntriesFilterForm = ({ onClear, showAdmin, status }) => {
  return (
    <Form noValidate>
      <FormError error={status} />
      <div className="flex flex-wrap -mx-2">
        <div className="w-full lg:w-1/2 px-2 mb-4">
          <Field component={DateField} label="Start Date" name="startDate" />
        </div>
        <div className="w-full lg:w-1/2 px-2 mb-4">
          <Field component={DateField} label="End Date" name="endDate" />
        </div>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full lg:w-1/2 px-2 mb-4">
          <Field
            component={ClientField}
            label="Client"
            name="clientId"
            projectField="projectId"
          />
        </div>
        <div className="w-full lg:w-1/2 px-2 mb-4">
          <Field
            clientField="clientId"
            component={ProjectField}
            label="Project"
            name="projectId"
          />
        </div>
      </div>
      {showAdmin && (
        <div className="mb-4">
          <Field component={UserField} label="User" name="userId" />
        </div>
      )}
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 md:mb-0 mb-4">
          <Button className="py-2 px-4 w-full" color="green" type="submit">
            {'Filter'}
          </Button>
        </div>
        <div className="w-full md:w-1/2 px-2">
          <Button className="py-2 px-4 w-full" onClick={onClear} type="button">
            {'Clear'}
          </Button>
        </div>
      </div>
    </Form>
  );
};

EntriesFilterForm.propTypes = {
  onClear: PropTypes.func.isRequired,
  showAdmin: PropTypes.bool.isRequired,
  status: PropTypes.string
};

EntriesFilterForm.defaultProps = {
  status: null
};

export default EntriesFilterForm;
