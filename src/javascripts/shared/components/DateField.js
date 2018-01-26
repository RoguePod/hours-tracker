import { FieldError, FieldWarning } from 'javascripts/shared/components';
import { Form, Input } from 'semantic-ui-react';

import DatePicker from 'react-datepicker';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import moment from 'moment';

class DateField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    label: PropTypes.string.isRequired,
    meta: PropTypes.shape({
      errpr: PropTypes.string,
      touched: PropTypes.bool
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
    const { label, input, meta } = this.props;

    let date = null;
    if (input.value && input.value.length > 0) {
      date = moment(input.value);
    }

    const component = (
      <Input
        value={input.value}
      />
    );

    return (
      <Form.Field>
        {label &&
          <label>
            {label}
          </label>}
        <DatePicker
          customInput={component}
          isClearable
          onChange={this._handleChange}
          selected={date}
        />
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </Form.Field>
    );
  }
}

export default DateField;
