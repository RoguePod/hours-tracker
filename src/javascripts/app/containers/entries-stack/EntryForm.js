import {
  CheckboxField,
  Collapse,
  FormError,
  SubmitButton,
  TextAreaField,
  TimeField,
  TimezoneField
} from 'javascripts/shared/components';
import { Field, Form } from 'formik';
import { ProjectField, UserField } from 'javascripts/app/components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import styled from 'styled-components';

const Link = styled.div`
  outline: none;
`;

const EntryForm = ({ admin, isSubmitting, status, values }) => {
  const { timezone } = values;
  const [open, setOpen] = React.useState(false);

  return (
    <Form noValidate>
      <FormError error={status} />
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            autoFocus
            component={TimeField}
            label="Started"
            name="startedAt"
            timezone={timezone}
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            component={TimeField}
            label="Stopped"
            name="stoppedAt"
            timezone={timezone}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            billableField="billable"
            clientField="clientId"
            component={ProjectField}
            label="Project"
            name="projectId"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field component={TimezoneField} label="Timezone" name="timezone" />
        </div>
      </div>
      {admin && (
        <div>
          <Link
            className="hover:text-blue text-blue mb-2"
            onClick={() => setOpen(!open)}
            role="button"
            tabIndex={-1}
          >
            {'Admin Fields '}
            <FontAwesomeIcon icon={open ? 'caret-down' : 'caret-right'} />
          </Link>
          <Collapse open={open}>
            <div>
              <div className="mb-4">
                <Field component={UserField} label="User" name="userId" />
              </div>
              <div className="pb-4">
                <Field
                  component={CheckboxField}
                  label="Billable?"
                  name="billable"
                />
              </div>
            </div>
          </Collapse>
        </div>
      )}
      <div className="mb-4">
        <Field
          autoHeight
          component={TextAreaField}
          label="Description"
          name="description"
          rows={1}
        />
      </div>
      <SubmitButton submitting={isSubmitting}>{'Save'}</SubmitButton>
    </Form>
  );
};

EntryForm.propTypes = {
  admin: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  status: PropTypes.string,
  values: PropTypes.shape({
    timezone: PropTypes.string
  }).isRequired
};

EntryForm.defaultProps = {
  status: null
};

export default EntryForm;
