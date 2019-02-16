import {
  CheckboxField,
  FormError,
  SubmitButton,
  TextAreaField,
  TimeField,
  TimezoneField
} from "javascripts/shared/components";
import { Field, Form } from "formik";

import { ProjectField } from "javascripts/app/components";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import { isBlank } from "javascripts/globals";

const EntryEditMultipleForm = props => {
  const { isSubmitting, setFieldTouched, status, values, timezone } = props;

  const [update, setUpdate] = React.useState(values.update || {});

  React.useEffect(() => {
    if (!_isEqual(update, values.update)) {
      setUpdate(values.update);
      const fields = [
        "startedAt",
        "stoppedAt",
        "timezone",
        "description",
        "projectId"
      ];

      fields.forEach(field => {
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
            disabled={!_get(values, "update.startedAt")}
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
            disabled={!_get(values, "update.stoppedAt")}
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
            clientField="clientId"
            component={ProjectField}
            disabled={!_get(values, "update.projectId")}
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
            disabled={!_get(values, "update.timezone")}
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
      <div className="mb-4">
        <Field
          autoHeight
          component={TextAreaField}
          disabled={!_get(values, "update.description")}
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
      <SubmitButton submitting={isSubmitting}>{"Save Multiple"}</SubmitButton>
    </Form>
  );
};

EntryEditMultipleForm.propTypes = {
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
