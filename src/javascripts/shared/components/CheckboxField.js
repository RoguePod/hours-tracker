import { Checkbox, Form } from 'semantic-ui-react';

import PropTypes from 'javascripts/prop-types';
import React from 'react';

class CheckboxField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      /* eslint-disable react/forbid-prop-types */
      value: PropTypes.any
      /* eslint-enable react/forbid-prop-types */
    }).isRequired,
    label: PropTypes.node,
    meta: PropTypes.shape({
      errpr: PropTypes.string,
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

  _handleChange(event, data) {
    const { input: { onChange } } = this.props;

    onChange(data.checked);
  }

  render() {
    const { input, meta, ...rest } = this.props;

    return (
      <Form.Field
        error={meta.error && meta.dirty}
      >
        <Checkbox
          {...rest}
          checked={Boolean(input.value)}
          onChange={this._handleChange}
        />
      </Form.Field>
    );
  }
}

export default CheckboxField;
