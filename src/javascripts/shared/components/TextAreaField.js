import { FieldError, FieldWarning } from 'javascripts/shared/components';
import { Form, TextArea } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

class TextAreaField extends React.Component {
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
    }).isRequired
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
    const { label, input, meta, ...rest } = this.props;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    return (
      <Form.Field
        error={isError}
      >
        {label &&
          <label>
            {label}
          </label>}
        <TextArea
          {...input}
          {...rest}
          ref={this._handleRef}
        />
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </Form.Field>
    );
  }
}

export default TextAreaField;
