import {
  InputField,
  TextAreaField,
  TimeField,
  Tooltip
} from "javascripts/shared/components";

import { Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectField } from "javascripts/app/components";
import PropTypes from "javascripts/prop-types";
import React from "react";
import _sumBy from "lodash/sumBy";
import { calcHours } from "javascripts/globals";
import moment from "moment-timezone";
import styled from "styled-components";

const Close = styled.div`
  right: -0.75rem;
  top: -0.75rem;
`;

class SplitFormEntry extends React.Component {
  static propTypes = {
    form: PropTypes.shape({
      setFieldValue: PropTypes.func.isRequired,
      values: PropTypes.object.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired,
    remove: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this._handleHoursChange = this._handleHoursChange.bind(this);
    this._handlePercentChange = this._handlePercentChange.bind(this);
    this._handleRemove = this._handleRemove.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleRemove() {
    const {
      form: {
        setFieldValue,
        values: { entries }
      },
      index,
      remove
    } = this.props;

    const entry = entries[index];
    let updateIndex = 0;

    if (index === 0) {
      updateIndex = 1;
    }

    const updateEntry = entries[updateIndex];
    const hours = Number(updateEntry.hours) + Number(entry.hours);
    const percent = Number(updateEntry.percent) + Number(entry.percent);

    setFieldValue(`entries.${updateIndex}.hours`, hours);
    setFieldValue(`entries.${updateIndex}.percent`, percent);

    remove(index);

    setTimeout(() => this._handleCalculateOthers(updateIndex), 1);
  }

  _handleCalculateOthers(changedIndex) {
    const {
      form: { setFieldValue, values }
    } = this.props;
    const { entries, startedAt, stoppedAt, timezone } = values;

    const totalHours = calcHours(startedAt, stoppedAt, timezone);
    const currentHours = _sumBy(entries, entry => Number(entry.hours));
    const currentPercent = _sumBy(entries, entry => Number(entry.percent));

    let diffHours = totalHours - currentHours.toFixed(1);
    let diffPercent = 100.0 - currentPercent.toFixed(1);

    let hours = 0;
    entries.forEach((entry, index) => {
      let staticHours = Number(entry.hours);
      if (changedIndex !== index) {
        let percent = Number(entry.percent);

        if (diffHours > 0) {
          percent += diffPercent;
          staticHours += diffHours;

          diffPercent = 0;
          diffHours = 0;
        } else if (diffHours < 0) {
          if (percent + diffPercent < 0) {
            percent = 0;
            staticHours = 0;

            diffPercent -= percent;
            diffHours -= staticHours;
          } else {
            percent += diffPercent;
            staticHours += diffHours;

            diffPercent = 0;
            diffHours = 0;
          }
        }

        setFieldValue(`entries.${index}.hours`, staticHours.toFixed(1));
        setFieldValue(`entries.${index}.percent`, percent.toFixed(1));
      }

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

  _handleHoursChange(event) {
    const {
      index,
      form: {
        setFieldValue,
        values: { startedAt, stoppedAt, timezone }
      }
    } = this.props;

    const hours = calcHours(startedAt, stoppedAt, timezone);
    const value = Number(event.target.value);

    if (value > hours || value < 0) {
      return;
    }

    const percent = (value / hours) * 100.0;
    setFieldValue(`entries.${index}.percent`, percent.toFixed(1));

    setTimeout(() => this._handleCalculateOthers(index), 1);
  }

  _handlePercentChange(event) {
    const {
      index,
      form: {
        setFieldValue,
        values: { startedAt, stoppedAt, timezone }
      }
    } = this.props;

    const value = Number(event.target.value);

    if (value > 100 || value < 0) {
      return;
    }

    const hours = calcHours(startedAt, stoppedAt, timezone);
    const newHours = hours * (value / 100.0);
    setFieldValue(`entries.${index}.hours`, newHours.toFixed(1));

    setTimeout(() => this._handleCalculateOthers(index), 1);
  }

  render() {
    const {
      form: {
        isSubmitting,
        values: { entries, timezone }
      },
      index
    } = this.props;

    const closeClasses =
      "absolute bg-red text-white w-8 h-8 flex items-center cursor-pointer " +
      "justify-center rounded-full text-center border-4 border-white";

    return (
      <div className="border rounded mb-4 px-4 pt-4 relative">
        {entries.length > 2 && !isSubmitting && (
          <Tooltip title="Remove Entry">
            <Close className={closeClasses} onClick={this._handleRemove}>
              <FontAwesomeIcon icon="times" />
            </Close>
          </Tooltip>
        )}
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              clientField={`entries.${index}.clientId`}
              component={ProjectField}
              label="Project"
              name={`entries.${index}.projectId`}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              component={InputField}
              label="Hours"
              name={`entries.${index}.hours`}
              onChange={this._handleHoursChange}
              type="number"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              component={InputField}
              label="%"
              name={`entries.${index}.percent`}
              onChange={this._handlePercentChange}
              type="number"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              autoHeight
              component={TextAreaField}
              label="Description"
              name={`entries.${index}.description`}
              rows={1}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              component={TimeField}
              disabled
              label="Started"
              name={`entries.${index}.startedAt`}
              timezone={timezone}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              component={TimeField}
              disabled
              label="Stopped"
              name={`entries.${index}.stoppedAt`}
              timezone={timezone}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SplitFormEntry;
