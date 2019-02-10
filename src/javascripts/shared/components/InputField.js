import FieldError from './FieldError';
import InputBase from './InputBase';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class InputField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    onChange: PropTypes.func,
    type: PropTypes.string
  }

  static defaultProps = {
    disabled: false,
    onChange: null,
    type: 'text'
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleChange(event) {
    const { field, onChange } = this.props;

    field.onChange(event);

    if (onChange) {
      setTimeout(() => onChange(event), 1);
    }
  }

  render() {
    const {
      disabled, field, form: { errors, isSubmitting, touched }, ...rest
    } = this.props;

    const hasError = errors[field.name] && touched[field.name];

    return (
      <>
        <InputBase
          {...field}
          {...rest}
          disabled={disabled || isSubmitting}
          error={hasError}
          onChange={this._handleChange}
        />
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
      </>
    );
  }
}

export default InputField;
