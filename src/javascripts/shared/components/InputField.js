import FieldError from './FieldError';
import InputBase from './InputBase';
import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class InputField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    type: PropTypes.string
  }

  static defaultProps = {
    disabled: false,
    label: null,
    onChange: null,
    required: false,
    type: 'text'
  }

  constructor(props) {
    super(props);

    this.input = React.createRef();

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
      disabled, field, form: { errors, isSubmitting, touched },
      label, required, ...rest
    } = this.props;

    const hasError = errors[field.name] && touched[field.name];

    return (
      <>
        {label && label.length > 0 &&
          <Label
            error={hasError}
            htmlFor={this.input?.current?.id()}
            required={required}
          >
            {label}
          </Label>}
        <InputBase
          {...field}
          {...rest}
          disabled={disabled || isSubmitting}
          error={hasError}
          onChange={this._handleChange}
          ref={this.input}
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
