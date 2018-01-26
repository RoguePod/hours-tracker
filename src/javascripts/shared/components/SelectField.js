import { Dropdown, Form } from 'semantic-ui-react';
import { FieldError, FieldWarning } from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

class SelectField extends React.Component {
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

  _handleChange(event, data) {
    const { input: { onChange } } = this.props;

    onChange(data.value);
  }

  render() {
    const { label, input, meta, ...rest } = this.props;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    return (
      <Form.Field>
        {label &&
          <label>
            {label}
          </label>}
        <Dropdown
          {...input}
          {...rest}
          error={isError}
          fluid
          onChange={this._handleChange}
          selection
        />
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </Form.Field>
    );
  }
}

export default SelectField;
