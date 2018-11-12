import {
  Button,
  FormError,
  SelectField,
  TextAreaField,
  TimeField
} from 'javascripts/shared/components';
import { Field, reduxForm } from 'redux-form';
import { isParsedTime, isRequired, isStoppedAt } from 'javascripts/validators';

import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import moment from 'moment';

class EntryForm extends React.Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onSaveEntry: PropTypes.func.isRequired,
    running: PropTypes.entry,
    submitting: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    error: null,
    running: null
  }

  constructor(props) {
    super(props);

    this._handleProjectChange = this._handleProjectChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _parseDate(value, timezone) {
    const parsed = chrono.parseDate(value);

    if (!parsed) {
      return null;
    }

    const values = [
      parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
      parsed.getHours(), parsed.getMinutes()
    ];

    return moment.tz(values, timezone)
      .utc()
      .valueOf();
  }

  _handleSubmit(data) {
    const { onSaveEntry } = this.props;

    const params = {
      ...data,
      startedAt: this._parseDate(data.startedAt, data.timezone),
      stoppedAt: this._parseDate(data.stoppedAt, data.timezone)
    };

    return new Promise((resolve, reject) => {
      onSaveEntry(params, resolve, reject);
    });
  }

  _handleProjectChange(clientRef, projectRef) {
    const { change } = this.props;

    change('clientRef', clientRef);
    change('projectRef', projectRef);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const {
      error, handleSubmit, running, submitting, timezone
    } = this.props;

    const stoppedAtValidation = [isParsedTime, isStoppedAt];

    if (running) {
      stoppedAtValidation.unshift(isRequired);
    }

    const timezoneOptions = moment.tz.names().map((tz) => {
      return {
        text: tz,
        value: tz
      };
    });

    return (
      <form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              autoFocus
              component={TimeField}
              disabled={submitting}
              id="startedAt"
              label="Started"
              name="startedAt"
              timezone={timezone}
              type="text"
              validate={[isRequired, isParsedTime]}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              component={TimeField}
              disabled={submitting}
              label="Stopped"
              name="stoppedAt"
              timezone={timezone}
              type="text"
              validate={stoppedAtValidation}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <Field
              component={ProjectField}
              disabled={submitting}
              label="Project"
              name="projectName"
              nameClient="clientRef"
              nameProject="projectRef"
              onProjectChange={this._handleProjectChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <Field
              component={SelectField}
              disabled={submitting}
              label="Timezone"
              name="timezone"
              options={timezoneOptions}
              validate={[isRequired]}
            />
          </div>
        </div>
        <Field
          autoCapitalize="sentences"
          autoCorrect="on"
          autoHeight
          component={TextAreaField}
          disabled={submitting}
          label="Description"
          name="description"
          rows={1}
        />
        <Button
          className="py-2"
          color="green"
          disabled={submitting}
          loading={submitting}
          type="submit"
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default reduxForm({
  form: 'EntryForm'
})(EntryForm);
