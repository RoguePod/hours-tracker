import {
  InputField,
  TextAreaField,
  TimeField,
  Tooltip
} from 'javascripts/shared/components';

import { Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _sumBy from 'lodash/sumBy';
import { calcHours } from 'javascripts/globals';
import moment from 'moment-timezone';
import styled from 'styled-components';

const Close = styled.div`
  right: -0.75rem;
  top: -0.75rem;
`;

const SplitFormEntry = ({ form, index, remove }) => {
  const {
    values: { entries, startedAt, stoppedAt, timezone }
  } = form;

  const _handleRemove = () => {
    const entry = entries[index];
    let updateIndex = 0;

    if (index === 0) {
      updateIndex = 1;
    }

    const updateEntry = entries[updateIndex];
    const hours = Number(updateEntry.hours) + Number(entry.hours);
    const percent = Number(updateEntry.percent) + Number(entry.percent);

    form.setFieldValue(`entries.${updateIndex}.hours`, hours);
    form.setFieldValue(`entries.${updateIndex}.percent`, percent);

    remove(index);

    setTimeout(() => _handleCalculateOthers(updateIndex), 1);
  };

  const _handleCalculateOthers = (changedIndex) => {
    const totalHours = calcHours(startedAt, stoppedAt, timezone);
    const currentHours = _sumBy(entries, (entry) => Number(entry.hours));
    const currentPercent = _sumBy(entries, (entry) => Number(entry.percent));

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

        form.setFieldValue(`entries.${index}.hours`, staticHours.toFixed(1));
        form.setFieldValue(`entries.${index}.percent`, percent.toFixed(1));
      }

      form.setFieldValue(
        `entries.${index}.startedAt`,
        moment
          .tz(startedAt, timezone)
          .add(hours, 'hours')
          .valueOf()
      );

      if (index === entries.length - 1) {
        form.setFieldValue(`entries.${index}.stoppedAt`, stoppedAt);
      } else {
        form.setFieldValue(
          `entries.${index}.stoppedAt`,
          moment
            .tz(startedAt, timezone)
            .add(hours + staticHours, 'hours')
            .valueOf()
        );

        hours += staticHours;
      }
    });
  };

  const _handleHoursChange = (event) => {
    const hours = calcHours(startedAt, stoppedAt, timezone);
    const value = Number(event.target.value);

    if (value > hours || value < 0) {
      return;
    }

    const percent = (value / hours) * 100.0;
    form.setFieldValue(`entries.${index}.percent`, percent.toFixed(1));

    setTimeout(() => _handleCalculateOthers(index), 1);
  };

  const _handlePercentChange = (event) => {
    const value = Number(event.target.value);

    if (value > 100 || value < 0) {
      return;
    }

    const hours = calcHours(startedAt, stoppedAt, timezone);
    const newHours = hours * (value / 100.0);
    form.setFieldValue(`entries.${index}.hours`, newHours.toFixed(1));

    setTimeout(() => _handleCalculateOthers(index), 1);
  };

  const closeClasses =
    'absolute bg-red text-white w-8 h-8 flex items-center cursor-pointer ' +
    'justify-center rounded-full text-center border-4 border-white';

  return (
    <div className="border rounded mb-4 px-4 pt-4 relative">
      {entries.length > 2 && !form.isSubmitting && (
        <Tooltip title="Remove Entry">
          <Close className={closeClasses} onClick={_handleRemove}>
            <FontAwesomeIcon icon="times" />
          </Close>
        </Tooltip>
      )}
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <Field
            billableField={`entries.${index}.billable`}
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
            onChange={_handleHoursChange}
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
            onChange={_handlePercentChange}
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
};

SplitFormEntry.propTypes = {
  form: PropTypes.formikForm.isRequired,
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired
};

export default React.memo(SplitFormEntry);
