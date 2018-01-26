import { Grid, Icon } from 'semantic-ui-react';
import {
  InputField, TextAreaField, TimeField
} from 'javascripts/shared/components';
import {
  betweenValue, isParsedTime, isRequired, isStoppedAt
} from 'javascripts/validators';

import { Field } from 'redux-form';
import { ProjectField } from 'javascripts/app/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { formatFloatPositive } from 'javascripts/normalizers';

const betweenValue0and100 = betweenValue(0, 100);

class SplitFormEntry extends React.Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    currentValues: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    hours: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    member: PropTypes.string.isRequired,
    onParseDate: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    submitting: false
  }

  constructor(props) {
    super(props);

    this._handleProjectChange = this._handleProjectChange.bind(this);
    this._handleHoursChange = this._handleHoursChange.bind(this);
    this._handlePercentChange = this._handlePercentChange.bind(this);
    this._handleRemove = this._handleRemove.bind(this);
    this._handleValidateHours = this._handleValidateHours.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleProjectChange(clientRef, projectRef) {
    const { change, member } = this.props;

    change(`${member}.clientRef`, clientRef);
    change(`${member}.projectRef`, projectRef);
  }

  _handleRemove() {
    const { fields, index } = this.props;

    fields.remove(index);
  }

  _handleCalculateOthers(changedIndex, changedHours, changedPercent) {
    const { change, currentValues, onParseDate } = this.props;

    const startedAt = onParseDate(currentValues.startedAt);
    const stoppedAt = onParseDate(currentValues.stoppedAt);

    const totalHours = Number(
      stoppedAt
        .diff(startedAt, 'hours', true)
        .toFixed(1)
    );

    let totalPercent       = 0;
    const remainingPercent = 100 - changedPercent;
    let lastIndex = currentValues.entries.length - 1;

    if (lastIndex === changedIndex) {
      lastIndex -= 1;
    }

    currentValues.entries.forEach((entry, index) => {
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

        change(`entries.${index}.hours`, hours.toFixed(1));
        change(`entries.${index}.percent`, percent.toFixed(1));
      }

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

  _handleHoursChange(event) {
    const { change, hours, index, member } = this.props;

    const value = Number(event.target.value);

    if (value > hours) {
      return;
    }

    const percent = ((value / hours) * 100);

    change(`${member}.percent`, percent.toFixed(1));

    setTimeout(() => this._handleCalculateOthers(index, value, percent), 1);
  }

  _handlePercentChange(event) {
    const { change, hours, index, member } = this.props;

    const value = Number(event.target.value);

    if (value > 100) {
      return;
    }

    const calcHours = hours * (value / 100);

    change(`${member}.hours`, calcHours.toFixed(1));

    setTimeout(() => this._handleCalculateOthers(index, calcHours, value), 1);
  }

  _handleValidateHours(value) {
    const { hours } = this.props;

    return betweenValue(0, hours)(value);
  }

  render() {
    const { fields, member, submitting, timezone } = this.props;

    return (
      <Grid.Row>
        <Grid.Column>
          <Field
            component={ProjectField}
            disabled={submitting}
            label="Project"
            name={`${member}.projectName`}
            nameClient={`${member}.clientRef`}
            nameProject={`${member}.projectRef`}
            onProjectChange={this._handleProjectChange}
          />
          <Field
            autoCapitalize="sentences"
            autoCorrect="on"
            autoHeight
            component={TextAreaField}
            disabled={submitting}
            label="Description"
            name={`${member}.description`}
            rows={1}
          />
        </Grid.Column>
        <Grid.Column>
          <Field
            autoCapitalize="none"
            autoCorrect="off"
            component={InputField}
            disabled={submitting}
            format={formatFloatPositive}
            label="Hours"
            name={`${member}.hours`}
            onChange={this._handleHoursChange}
            type="text"
            validate={[isRequired, this._handleValidateHours]}
          />
          <Field
            autoCapitalize="none"
            autoCorrect="off"
            autoFocus
            component={TimeField}
            disabled
            label="Started"
            name={`${member}.startedAt`}
            timezone={timezone}
            type="text"
            validate={[isRequired, isParsedTime]}
          />
        </Grid.Column>
        <Grid.Column>
          <Field
            autoCapitalize="none"
            autoCorrect="off"
            component={InputField}
            disabled={submitting}
            format={formatFloatPositive}
            label="%"
            name={`${member}.percent`}
            onChange={this._handlePercentChange}
            type="text"
            validate={[isRequired, betweenValue0and100]}
          />
          <Field
            autoCapitalize="none"
            autoCorrect="off"
            component={TimeField}
            disabled
            label="Stopped"
            name={`${member}.stoppedAt`}
            timezone={timezone}
            type="text"
            validate={[isRequired, isParsedTime, isStoppedAt]}
          />
        </Grid.Column>
        {fields.length > 1 &&
          <Grid.Column
            verticalAlign="middle"
            width={1}
          >
            <Icon
              color="red"
              name="remove"
              onClick={this._handleRemove}
              size="huge"
            />
          </Grid.Column>}
      </Grid.Row>
    );
  }
}

export default SplitFormEntry;
