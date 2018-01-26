import { FieldError, FieldWarning } from 'javascripts/shared/components';
import { Form, Input } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import chrono from 'chrono-node';
import moment from 'moment';

class TimeField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
      error: PropTypes.string,
      touched: PropTypes.bool
    }).isRequired,
    timezone: PropTypes.string.isRequired
  }

  static defaultProps = {
    label: null
  }

  constructor(props) {
    super(props);

    this._handleRef = this._handleRef.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleRef(element) {
    this.element = element;
  }

  focus() {
    this.element.focus();
  }

  render() {
    const { label, input, meta, timezone, ...rest } = this.props;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    let warning = null;
    if (input.value && input.value.length > 0) {
      const parsed = chrono.parseDate(input.value);

      if (parsed) {
        const values = [
          parsed.getFullYear(), parsed.getMonth(), parsed.getDate(),
          parsed.getHours(), parsed.getMinutes()
        ];

        warning = moment.tz(values, timezone)
          .format('MM/DD/YYYY [a]t hh:mm A z');
      }
    }

    return (
      <Form.Field
        error={isError}
      >
        {label &&
          <label>
            {label}
          </label>}
        <Input
          {...input}
          {...rest}
          ref={this._handleRef}
        />
        <FieldError {...meta} />
        <FieldWarning
          touched
          warning={warning}
        />
      </Form.Field>
    );
  }
}

export default TimeField;
