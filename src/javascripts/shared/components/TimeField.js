import FieldHelper from './FieldHelper';
import InputField from './InputField';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import moment from 'moment';

class TimeField extends React.Component {
  static propTypes = {
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    nameField: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    id: null,
    label: null
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _parseDate(value, timezone) {
    const parsed = chrono.parseDate(value);

    if (!parsed) {
      return null;
    }

    const values = [
      parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
      parsed.getHours(), parsed.getMinutes()
    ];

    return moment.tz(values, timezone)
      .utc()
      .valueOf();
  }

  _handleChange({ target: { value } }) {
    const {
      field: { name }, nameField, form: { setFieldValue }, timezone
    } = this.props;

    setFieldValue(name, value);
    setFieldValue(nameField, this._parseDate(value, timezone));
  }

  render() {
    const { field: { value }, timezone } = this.props;
    /* eslint-disable no-unused-vars */
    const { nameField, ...rest } = this.props;
    /* eslint-enable no-unused-vars */

    let realTime = null;
    if (value && value.length > 0) {
      const parsed = chrono.parseDate(value);

      if (parsed) {
        const values = [
          parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
          parsed.getHours(), parsed.getMinutes()
        ];

        realTime = moment.tz(values, timezone)
          .format('MM/DD/YYYY [a]t hh:mm A z');
      }
    }

    return (
      <>
        <InputField
          {...rest}
          onChange={this._handleChange}
          type="text"
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
