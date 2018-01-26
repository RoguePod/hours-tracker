import { FieldError, FieldWarning } from 'javascripts/shared/components';
import { Form, Input } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

class FileInput extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.object
    }).isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
      error: PropTypes.string,
      touched: PropTypes.bool
    }).isRequired
  }

  static defaultProps = {
    label: null
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleChange(event) {
    const { input: { onChange } } = this.props;

    onChange(event.target.files[0]);
  }

  render() {
    const { label, input, meta, ...rest } = this.props;

    /* eslint-disable no-unneeded-ternary */
    let isError = meta.touched && meta.error ? true : false;
    if (input.value) {
      if (input.value.length === 0 && meta.touched) {
        isError = true;
        meta.error = 'File is Required';
      }
    }
    /* eslint-enable no-unneeded-ternary */

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
          onChange={this._handleChange}
          type="file"
        />
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </Form.Field>

    );
  }
}

export default FileInput;
