import { Field, reduxForm } from 'redux-form';
import { Form, Grid } from 'semantic-ui-react';
import {
  FormError, SelectField, TextAreaField, TimeField
} from 'javascripts/shared/components';
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
      <Form
        noValidate
        onSubmit={handleSubmit(this._handleSubmit)}
      >
        <FormError error={error} />
        <Grid
          columns="equal"
          stackable
        >
          <Grid.Row>
            <Grid.Column>
              <Field
                autoCapitalize="none"
                autoCorrect="off"
                autoFocus
                component={TimeField}
                disabled={submitting}
                label="Started"
                name="startedAt"
                timezone={timezone}
                type="text"
                validate={[isRequired, isParsedTime]}
              />
            </Grid.Column>
            <Grid.Column>
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
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Field
                component={ProjectField}
                disabled={submitting}
                label="Project"
                name="projectName"
                nameClient="clientRef"
                nameProject="projectRef"
                onProjectChange={this._handleProjectChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Field
                component={SelectField}
                disabled={submitting}
                label="Timezone"
                name="timezone"
                options={timezoneOptions}
                validate={[isRequired]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
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
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form.Button
                color="green"
                disabled={submitting}
                fluid
                loading={submitting}
                size="big"
              >
                {'Save'}
              </Form.Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default reduxForm({
  form: 'EntryForm'
})(EntryForm);
