import { Field, FieldArray, Form } from "formik";
import {
  FormError,
  SubmitButton,
  TimeField,
  TimezoneField
} from "javascripts/shared/components";

import PropTypes from "javascripts/prop-types";
import React from "react";
import SplitFormEntries from "./SplitFormEntries";
import { calcHours } from "javascripts/globals";
import moment from "moment-timezone";

class EntrySplitForm extends React.Component {
  static propTypes = {
    // hours: PropTypes.number.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    status: PropTypes.string,
    values: PropTypes.shape({
      entries: PropTypes.arrayOf(PropTypes.object).isRequired,
      timezone: PropTypes.string.isRequired
    }).isRequired
  };

  static defaultProps = {
    status: null
  };

  constructor(props) {
    super(props);

    this._handleCalculate = this._handleCalculate.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleCalculate() {
    const {
      isValid,
      setFieldValue,
      values: { entries, startedAt, stoppedAt, timezone }
    } = this.props;

    if (!isValid) {
      return;
    }

    const totalHours = calcHours(startedAt, stoppedAt, timezone);
    let totalPercent = 0;

    let hours = 0.0;
    entries.forEach((entry, index) => {
      let percent = Number(entry.percent);
      totalPercent += percent;

      if (totalPercent > 100) {
        percent = 0;
      }

      const staticHours = totalHours * (percent / 100.0);

      setFieldValue(`entries.${index}.hours`, staticHours.toFixed(1));
      setFieldValue(`entries.${index}.percent`, percent.toFixed(1));
      setFieldValue(
        `entries.${index}.startedAt`,
        moment
          .tz(startedAt, timezone)
          .add(hours, "hours")
          .valueOf()
      );

      if (index === entries.length - 1) {
        setFieldValue(`entries.${index}.stoppedAt`, stoppedAt);
      } else {
        setFieldValue(
          `entries.${index}.stoppedAt`,
          moment
            .tz(startedAt, timezone)
            .add(hours + staticHours, "hours")
            .valueOf()
        );
        hours += staticHours;
      }
    });
  }

  render() {
    const {
      isSubmitting,
      status,
      values: { timezone }
    } = this.props;

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
              onChange={this._handleCalculate}
              timezone={timezone}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <Field
              component={TimeField}
              label="Stopped"
              name="stoppedAt"
              onChange={this._handleCalculate}
              timezone={timezone}
            />
          </div>
        </div>
        <div className="mb-4">
          <Field component={TimezoneField} label="Timezone" name="timezone" />
        </div>
        <div className="mb-4">
          <FieldArray component={SplitFormEntries} name="entries" />
        </div>
        <SubmitButton submitting={isSubmitting}>{"Save"}</SubmitButton>
      </Form>
    );
  }
}

export default EntrySplitForm;
