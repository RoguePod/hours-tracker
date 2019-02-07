import FieldError from './FieldError';
import FieldHelper from './FieldHelper';
import InputBase from './InputBase';
import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import { isBlank } from 'javascripts/globals';
import moment from 'moment-timezone';

class TimeField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    disabled: false,
    id: null,
    label: null,
    required: false
  }

  constructor(props) {
    super(props);

    this.input = React.createRef();
    this._handleChange = this._handleChange.bind(this);

    this.state = {
      value: this._formatValue(props.field.value, props.timezone)
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { field: { name, value }, form: { touched }, timezone } = this.props;

    const isTouched = touched[name];
    if (!isTouched && prevProps.field.value !== value) {
      this.setState({
        value: this._formatValue(value, timezone)
      });
    }
  }

  _parseDate(value, timezone) {
    if (isBlank(value)) {
      return null;
    }

    const parsed = chrono.parseDate(value);

    if (!parsed) {
      return -1;
    }

    const values = [
      parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
      parsed.getHours(), parsed.getMinutes()
    ];

    return moment.tz(values, timezone)
      .utc()
      .valueOf();
  }

  _formatValue(value, timezone) {
    if (value && value > 0) {
      const date = moment.tz(value, timezone);

      if (date && date.isValid()) {
        return date.format('MM/DD/YYYY [a]t hh:mm A z');
      }
    }

    return '';
  }

  _handleChange({ target: { value } }) {
    const {
      field: { name }, form: { setFieldTouched, setFieldValue }, timezone
    } = this.props;

    setFieldTouched(name, true);
    setFieldValue(name, this._parseDate(value, timezone));
    this.setState({ value });
  }

  render() {
    const {
      disabled, field, form: { errors, isSubmitting, touched },
      label, required, timezone, ...rest
    } = this.props;
    const { value } = this.state;

    const hasError = errors[field.name] && touched[field.name];
    const realTime = this._formatValue(field.value, timezone);

    return (
      <>
        {label && label.length > 0 &&
          <Label
            error={hasError}
            htmlFor={this.input?.current?.id()}
            required={required}
          >
            {label}
          </Label>}
        <InputBase
          {...rest}
          autoCapitalize="none"
          autoCorrect="off"
          disabled={disabled || isSubmitting}
          error={hasError}
          name={field.name}
          onChange={this._handleChange}
          ref={this.input}
          type="text"
          value={value}
        />
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
        <FieldHelper
          className="text-green"
          color="green"
          message={realTime}
          open={Boolean(realTime)}
        />
      </>
    );
  }
}

export default TimeField;
