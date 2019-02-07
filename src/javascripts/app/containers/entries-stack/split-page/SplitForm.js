import {
  Button,
  FormError,
  TimeField,
  TimezoneField
} from 'javascripts/shared/components';
import { Field, FieldArray, Form } from 'formik';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitFormEntries from './SplitFormEntries';
import chrono from 'chrono-node';
import moment from 'moment-timezone';

class EntrySplitForm extends React.Component {
  static propTypes = {
    // hours: PropTypes.number.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
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

    // this._handleSubmit = this._handleSubmit.bind(this);
    this._renderEntries = this._renderEntries.bind(this);
    this._handleStartedAtChanged = this._handleStartedAtChanged.bind(this);
    this._handleStoppedAtChanged = this._handleStoppedAtChanged.bind(this);
    this._parseDate = this._parseDate.bind(this);
    this._handleCalculate = this._handleCalculate.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _parseDate(value) {
    const { values: { timezone } } = this.props;

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

  // _handleSubmit(data) {
  //   const { onSplitEntry } = this.props;

  //   return new Promise((resolve, reject) => {
  //     const entries = data.entries.map((entry) => {
  //       const {
  //         clientRef, description, projectRef, startedAt, stoppedAt
  //       } = entry;

  //       return {
  //         clientRef,
  //         description,
  //         projectRef,
  //         startedAt: this._parseDateValue(startedAt),
  //         stoppedAt: this._parseDateValue(stoppedAt)
  //       };
  //     });

  //     onSplitEntry(entries, resolve, reject);
  //   });
  // }

  _handleCalculate(values) {
    const { isValid, setFieldValue, values: { entries } } = this.props;

    if (!isValid) {
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

      setFieldValue(`entries.${index}.hours`, hours.toFixed(1));
      setFieldValue(`entries.${index}.percent`, percent.toFixed(1));
      setFieldValue(
        `entries.${index}.startedAt`,
        startedAt.format('MM/DD/YYYY hh:mm A z')
      );
      setFieldValue(
        `entries.${index}.stoppedAt`,
        startedAt.add(hours, 'hours').format('MM/DD/YYYY hh:mm A z')
      );
    });
  }

  _handleStartedAtChanged(event, value) {
    const { values } = this.props;

    let startedAt = this._parseDate(value);

    if (startedAt) {
      startedAt = startedAt.format('MM/DD/YYYY hh:mm A z');

      const newValues = { ...values, startedAt };

      setTimeout(() => this._handleCalculate(newValues), 1);
    }
  }

  _handleStoppedAtChanged(event, value) {
    const { values } = this.props;

    let stoppedAt = this._parseDate(value);

    if (stoppedAt) {
      stoppedAt = stoppedAt.format('MM/DD/YYYY hh:mm A z');

      const newValues = { ...values, stoppedAt };

      setTimeout(() => this._handleCalculate(newValues), 1);
    }
  }

  _renderEntries(helpers) {
    return (
      <SplitFormEntries
        {...this.props}
        helpers={helpers}
        onParseDate={this._parseDate}
      />
    );
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
              autoFocus
              component={TimeField}
              label="Started"
              name="startedAt"
              onChange={this._handleStartedAtChanged}
              timezone={timezone}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={TimeField}
              label="Stopped"
              name="stoppedAt"
              onChange={this._handleStoppedAtChanged}
              timezone={timezone}
            />
          </div>
        </div>
        <div className="mb-4">
          <Field
            component={TimezoneField}
            label="Timezone"
            name="timezone"
          />
        </div>
        <div className="mb-4">
          <FieldArray
            name="entries"
            render={this._renderEntries}
          />
        </div>
        <Button
          className="py-2 w-full text-lg"
          color="green"
          disabled={isSubmitting}
          loading={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Splitting...' : 'Split'}
        </Button>
      </Form>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default EntrySplitForm;
