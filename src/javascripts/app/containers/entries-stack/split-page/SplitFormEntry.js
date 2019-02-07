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
// import { formatFloatPositive } from 'javascripts/normalizers';
import styled from 'styled-components';

const Close = styled.div`
  top: -0.75rem;
  right: -0.75rem;
`;

class SplitFormEntry extends React.Component {
  static propTypes = {
    helpers: PropTypes.shape({
      remove: PropTypes.func.isRequired
    }).isRequired,
    // hours: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    onParseDate: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this._handleHoursChange = this._handleHoursChange.bind(this);
    this._handlePercentChange = this._handlePercentChange.bind(this);
    this._handleRemove = this._handleRemove.bind(this);
    this._handleValidateHours = this._handleValidateHours.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleRemove() {
    const { helpers, index } = this.props;

    helpers.remove(index);
  }

  _handleCalculateOthers(changedIndex, changedHours, changedPercent) {
    const { setFieldValue, onParseDate, values } = this.props;

    const startedAt = onParseDate(values.startedAt);
    const stoppedAt = onParseDate(values.stoppedAt);

    const totalHours = Number(
      stoppedAt.diff(startedAt, 'hours', true).toFixed(1)
    );

    let totalPercent       = 0;
    const remainingPercent = 100 - changedPercent;
    let lastIndex          = values.entries.length - 1;

    if (lastIndex === changedIndex) {
      lastIndex -= 1;
    }

    values.entries.forEach((entry, index) => {
      let hours = 0;
      if (changedIndex === index) {
        hours = changedHours;
      } else {
        let percent = Number(entry.percent);

        if (totalPercent > remainingPercent) {
          percent = 0;
        } else if (index === lastIndex) {
          percent = remainingPercent - totalPercent;
        }

        totalPercent += percent;

        hours = totalHours * (percent / 100.0);

        setFieldValue(`entries.${index}.hours`, hours.toFixed(1));
        setFieldValue(`entries.${index}.percent`, percent.toFixed(1));
      }

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

  _handleHoursChange(event) {
    const { setFieldValue, index } = this.props;

    const hours = 100;

    const value = Number(event.target.value);

    if (value > hours) {
      return;
    }

    const percent = ((value / hours) * 100);

    setFieldValue(`entries.${index}.percent`, percent.toFixed(1));

    setTimeout(() => this._handleCalculateOthers(index, value, percent), 1);
  }

  _handlePercentChange(event) {
    const { setFieldValue, index } = this.props;

    const value = Number(event.target.value);

    const hours = 100;

    if (value > 100) {
      return;
    }

    const calcHours = hours * (value / 100);

    setFieldValue(`entries.${index}.hours`, calcHours.toFixed(1));

    setTimeout(() => this._handleCalculateOthers(index, calcHours, value), 1);
  }

  _handleValidateHours() {
    // const { hours } = this.props;

    // return betweenValue(0, hours)(value);
  }

  /* eslint-disable max-lines-per-function */
  render() {
    const {
      index, values: { entries, timezone }
    } = this.props;

    const closeClasses =
      'absolute bg-red text-white w-8 h-8 flex items-center cursor-pointer ' +
      'justify-center rounded-full text-center border-4 border-white';

    return (
      <div className="border rounded mb-4 px-4 pt-4 relative">
        {entries.length > 1 &&
          <Tooltip
            title="Remove Entry"
          >
            <Close
              className={closeClasses}
              onClick={this._handleRemove}
            >
              <FontAwesomeIcon
                icon="times"
              />
            </Close>
          </Tooltip>}
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              clientField={`entries.${index}.clientRef`}
              component={ProjectField}
              label="Project"
              name={`entries.${index}.projectRef`}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              component={InputField}
              // format={formatFloatPositive}
              label="Hours"
              name={`entries.${index}.hours`}
              // onChange={this._handleHoursChange}
              type="text"
              // validate={[isRequired, this._handleValidateHours]}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              autoCapitalize="none"
              autoCorrect="off"
              component={InputField}
              // format={formatFloatPositive}
              label="%"
              name={`entries.${index}.percent`}
              // onChange={this._handlePercentChange}
              type="text"
              // validate={[isRequired, betweenValue0and100]}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              autoCapitalize="sentences"
              autoCorrect="on"
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
              // validate={[isRequired, isParsedTime]}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <Field
              component={TimeField}
              disabled
              label="Stopped"
              name={`entries.${index}.stoppedAt`}
              timezone={timezone}
              // validate={[isRequired, isParsedTime, isStoppedAt]}
            />
          </div>
        </div>
      </div>
    );
  }
  /* eslint-enable max-lines-per-function */
}

export default SplitFormEntry;
