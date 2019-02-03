import FieldError from './FieldError';
import InputBase from './InputBase';
import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';

class InputField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    type: PropTypes.string
  }

  static defaultProps = {
    className: null,
    disabled: false,
    id: null,
    label: null,
    required: false,
    type: 'text'
  }

  constructor(props) {
    super(props);

    this.input = React.createRef();
  }

  shouldComponentUpdate() {
    return true;
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
