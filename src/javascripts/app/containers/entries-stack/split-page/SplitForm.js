import { Field, FieldArray, reduxForm } from 'redux-form';
import { Form, Grid } from 'semantic-ui-react';
import { FormError, TimeField } from 'javascripts/shared/components';
import { isParsedTime, isRequired, isStoppedAt } from 'javascripts/validators';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitFormEntries from './SplitFormEntries';
import chrono from 'chrono-node';
import moment from 'moment';

class EntrySplitForm extends React.Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    currentValues: PropTypes.object.isRequired,
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    hours: PropTypes.number.isRequired,
    onSplitEntry: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    timezone: PropTypes.string.isRequired,
    valid: PropTypes.bool.isRequired
  }

  static defaultProps = {
    error: null
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleRenderEntries = this._handleRenderEntries.bind(this);
    this._handleStartedAtChanged = this._handleStartedAtChanged.bind(this);
    this._handleStoppedAtChanged = this._handleStoppedAtChanged.bind(this);
    this._parseDate = this._parseDate.bind(this);
    this._handleCalculate = this._handleCalculate.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _parseDate(value) {
    const { timezone } = this.props;

    const parsed = chrono.parseDate(value);

    if (!parsed) {
      return null;
    }

    const values = [
      parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
      parsed.getHours(), parsed.getMinutes()
    ];

    return moment.tz(values, timezone);
  }

  _parseDateValue(value) {
    return this._parseDate(value)
      .utc()
      .valueOf();
  }

  _handleSubmit(data) {
    const { onSplitEntry } = this.props;

    return new Promise((resolve, reject) => {
      const entries = data.entries.map((entry) => {
        const {
          clientRef, description, projectRef, startedAt, stoppedAt
        } = entry;

        return {
          clientRef,
          description,
          projectRef,
          startedAt: this._parseDateValue(startedAt),
          stoppedAt: this._parseDateValue(stoppedAt)
        };
      });

      onSplitEntry(entries, resolve, reject);
    });
  }

  _handleRenderEntries(props) {
    const { change, currentValues, hours, timezone, valid } = this.props;

    return (
      <SplitFormEntries
        {...props}
        change={change}
        currentValues={currentValues}
        hours={hours}
        onParseDate={this._parseDate}
        timezone={timezone}
        valid={valid}
      />
    );
  }

  _handleCalculate(values) {
    const { change, valid } = this.props;
    const { entries } = values;

    if (!valid) {
      return;
    }

    const startedAt = this._parseDate(values.startedAt);
    const stoppedAt = this._parseDate(values.stoppedAt);

    const totalHours = Number(
      stoppedAt
        .diff(startedAt, 'hours', true)
        .toFixed(1)
    );

    let totalPercent = 0;

    entries.forEach((entry, index) => {
      let percent = Number(entry.percent);
      totalPercent += percent;

      if (totalPercent > 100) {
        percent = 0;
      }

      const hours = totalHours * (percent / 100.0);

      change(`entries.${index}.hours`, hours.toFixed(1));
      change(`entries.${index}.percent`, percent.toFixed(1));
      change(
        `entries.${index}.startedAt`,
        startedAt.format('MM/DD/YYYY hh:mm A z')
      );
      change(
        `entries.${index}.stoppedAt`,
        startedAt.add(hours, 'hours').format('MM/DD/YYYY hh:mm A z')
      );
    });
  }

  _handleStartedAtChanged(event, value) {
    const { currentValues } = this.props;

    let startedAt = this._parseDate(value);

    if (startedAt) {
      startedAt = startedAt.format('MM/DD/YYYY hh:mm A z');

      const values = Object.assign({}, currentValues, { startedAt });

      setTimeout(() => this._handleCalculate(values), 1);
    }
  }

  _handleStoppedAtChanged(event, value) {
    const { currentValues } = this.props;

    let stoppedAt = this._parseDate(value);

    if (stoppedAt) {
      stoppedAt = stoppedAt.format('MM/DD/YYYY hh:mm A z');

      const values = Object.assign({}, currentValues, { stoppedAt });

      setTimeout(() => this._handleCalculate(values), 1);
    }
  }

  render() {
    const {
      error, handleSubmit, submitting, timezone
    } = this.props;

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
                onChange={this._handleStartedAtChanged}
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
                onChange={this._handleStoppedAtChanged}
                timezone={timezone}
                type="text"
                validate={[isRequired, isParsedTime, isStoppedAt]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <FieldArray
                component={this._handleRenderEntries}
                name="entries"
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
}

export default reduxForm({
  form: 'EntrySplitForm'
})(EntrySplitForm);
