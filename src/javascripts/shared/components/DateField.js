import DatePicker from "react-datepicker";
import { InputField } from "javascripts/shared/components";
import PropTypes from "javascripts/prop-types";
import React from "react";
import moment from "moment-timezone";

class DateField extends React.Component {
  static propTypes = {
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired
  };

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleChange(value) {
    const {
      field: { name },
      form: { setFieldValue }
    } = this.props;

    const date = moment(value);

    if (date && date.isValid()) {
      setFieldValue(name, date.format("YYYY-MM-DD"));
    } else {
      setFieldValue(name, "");
    }
  }

  render() {
    const {
      field: { value }
    } = this.props;

    let date = null;
    if (value && value.length > 0) {
      date = moment(value).toDate();
    }

    const component = <InputField {...this.props} />;

    return (
      <DatePicker
        customInput={component}
        onChange={this._handleChange}
        selected={date}
      />
    );
  }
}

export default DateField;
