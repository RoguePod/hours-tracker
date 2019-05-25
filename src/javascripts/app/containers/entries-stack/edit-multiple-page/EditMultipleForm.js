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
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';

const Link = styled.div`
  outline: none;
`;

const EntryEditMultipleForm = (props) => {
  const {
    admin,
    isSubmitting,
    setFieldTouched,
    status,
    values,
    timezone
  } = props;

  const [update, setUpdate] = React.useState(values.update || {});
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!_isEqual(update, values.update)) {
      setUpdate(values.update);
      const fields = [
        'billable',
        'description',
        'projectId',
        'startedAt',
        'stoppedAt',
        'timezone',
        'userId'
      ];

      fields.forEach((field) => {
        setFieldTouched(field, Boolean(_get(values, `update.${field}`, false)));
      });
    }
  });

  return (
    <Form noValidate>
      <FormError error={status} />
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            autoFocus
            component={TimeField}
            disabled={!_get(values, 'update.startedAt')}
            label="Started"
            name="startedAt"
            timezone={isBlank(values.timezone) ? timezone : values.timezone}
          />
          <div className="pt-1">
            <Field
              component={CheckboxField}
              label="Update Started"
              name="update.startedAt"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            component={TimeField}
            disabled={!_get(values, 'update.stoppedAt')}
            label="Stopped"
            name="stoppedAt"
            timezone={timezone}
          />
          <div className="pt-1">
            <Field
              component={CheckboxField}
              label="Update Stopped"
              name="update.stoppedAt"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            billableField="billable"
            clientField="clientId"
            component={ProjectField}
            disabled={!_get(values, 'update.projectId')}
            label="Project"
            name="projectId"
          />
          <div className="pt-1">
            <Field
              component={CheckboxField}
              label="Update Project"
              name="update.projectId"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <Field
            component={TimezoneField}
            disabled={!_get(values, 'update.timezone')}
            label="Timezone"
            name="timezone"
          />
          <div className="pt-1">
            <Field
              component={CheckboxField}
              label="Update Timezone"
              name="update.timezone"
            />
          </div>
        </div>
      </div>
      {admin && (
        <div>
          <Link
            className="hover:text-blue-600 hover:underline text-blue-500 mb-2"
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
                <Field
                  component={UserField}
                  disabled={!_get(values, 'update.userId')}
                  label="User"
                  name="userId"
                />
                <div className="pt-1">
                  <Field
                    component={CheckboxField}
                    label="Update User"
                    name="update.userId"
                  />
                </div>
              </div>
              <div className="pb-4">
                <Field
                  component={CheckboxField}
                  disabled={!_get(values, 'update.billable')}
                  label="Billable?"
                  name="billable"
                />
                <div className="pt-1">
                  <Field
                    component={CheckboxField}
                    label="Update Billable"
                    name="update.billable"
                  />
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      )}
      <div className="mb-4">
        <Field
          autoHeight
          component={TextAreaField}
          disabled={!_get(values, 'update.description')}
          label="Description"
          name="description"
          rows={1}
        />
        <div className="pt-1">
          <Field
            component={CheckboxField}
            label="Update Description"
            name="update.description"
          />
        </div>
      </div>
      <SubmitButton submitting={isSubmitting}>{'Save Multiple'}</SubmitButton>
    </Form>
  );
};

EntryEditMultipleForm.propTypes = {
  admin: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  status: PropTypes.string,
  timezone: PropTypes.string.isRequired,
  values: PropTypes.shape({
    timezone: PropTypes.string
  }).isRequired
};

EntryEditMultipleForm.defaultProps = {
  status: null
};

export default EntryEditMultipleForm;
