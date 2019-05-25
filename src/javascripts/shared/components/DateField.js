import { Dropdown, FieldError, InputBase } from 'javascripts/shared/components';

import Calendar from './Calendar';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import moment from 'moment-timezone';

class DateField extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired
  };

  static defaultProps = {
    disabled: false
  };

  constructor(props) {
    super(props);

    this._target = React.createRef();
    this._handleChange = this._handleChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._findValue = this._findValue.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleCalendarChange = this._handleCalendarChange.bind(this);

    this.state = {
      focused: false,
      value: this._findValue(props.field.value)
    };
  }

  _startDate() {
    const {
      field: { value }
    } = this.props;

    let date = moment(value);

    if (!date.isValid()) {
      date = moment();
    }
  }

  _handleKeyDown(event) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      this._handleBlur();
      this.setState({ focused: false });
    }
  }

  _handleChange({ target: { value } }) {
    const {
      field,
      form: { setFieldTouched, setFieldValue }
    } = this.props;

    this.setState({ value });

    const parsed = chrono.parseDate(value);

    if (parsed) {
      const values = [
        parsed.getFullYear(),
        parsed.getMonth(),
        parsed.getDate()
      ];

      const date = moment(values).startOf('day');

      if (date.isValid()) {
        setFieldTouched(field.name, true);
        setFieldValue(field.name, date.format('YYYY-MM-DD'));
      }
    }
  }

  _handleBlur() {
    const {
      field,
      form: { setFieldTouched, setFieldValue }
    } = this.props;
    const { value } = this.state;

    if (value.length === 0) {
      setFieldTouched(field.name, true);
      setFieldValue(field.name, null);

      this.setState({ value: this._findValue(null) });
    } else {
      this.setState({ value: this._findValue(field.value) });
    }
  }

  _handleFocus({ target }) {
    const {
      field: { value }
    } = this.props;

    this.setState({ focused: true, value: this._findValue(value) }, () => {
      setTimeout(() => target.select(), 1);
    });
  }

  _findValue(value) {
    let date = moment(value);

    if (date.isValid()) {
      return date.format('MM/DD/YYYY');
    }

    return '';
  }

  _handleClose() {
    this.setState({ focused: false });
  }

  _handleCalendarChange(value) {
    const {
      field,
      form: { setFieldTouched, setFieldValue }
    } = this.props;

    setFieldTouched(field.name, true);
    setFieldValue(field.name, value.format('YYYY-MM-DD'));

    this.setState({
      focused: false,
      value: this._findValue(value.format('YYYY-MM-DD'))
    });
  }

  render() {
    const {
      disabled,
      field,
      form: { errors, isSubmitting, touched },
      ...rest
    } = this.props;

    const { focused, value } = this.state;

    const hasError = errors[field.name] && touched[field.name];

    return (
      <div className="relative" ref={this._target}>
        <InputBase
          {...rest}
          disabled={disabled || isSubmitting}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          onKeyDown={this._handleKeyDown}
          value={value}
        />
        <FieldError error={errors[field.name]} touched={touched[field.name]} />
        <Dropdown
          error={hasError}
          onClose={this._handleClose}
          open={focused}
          target={this._target}
        >
          <Calendar onChange={this._handleCalendarChange} value={field.value} />
        </Dropdown>
        <FieldError
          error={errors[field.name]}
          touched={Boolean(touched[field.name])}
        />
      </div>
    );
  }
}

export default DateField;
