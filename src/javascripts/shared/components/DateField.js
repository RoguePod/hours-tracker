import DatePicker from 'react-datepicker';
import { InputField } from 'javascripts/shared/components';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import moment from 'moment';

class DateField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleChange(date) {
    const { input: { onChange } } = this.props;

    if (date) {
      onChange(date.format('YYYY-MM-DD'));
    } else {
      onChange('');
    }
  }

  render() {
    const { input: { value } } = this.props;

    let date = null;
    if (value && value.length > 0) {
      date = moment(value);
    }

    const component = (
      <InputField
        {...this.props}
      />
    );

    return (
      <DatePicker
        customInput={component}
        isClearable
        onChange={this._handleChange}
        selected={date}
      />
    );
  }
}

export default DateField;
