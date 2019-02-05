import FieldError from './FieldError';
import Label from './Label';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SelectBase from './SelectBase';

class SelectField extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool
  }

  static defaultProps = {
    children: null,
    disabled: false,
    label: null,
    required: false
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
      children, disabled, field,
      form: { errors, isSubmitting, touched }, label, required, ...rest
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
        <SelectBase
          {...field}
          {...rest}
          disabled={disabled || isSubmitting}
          error={hasError}
          ref={this.input}
        >
          {children}
        </SelectBase>
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
      </>
    );
  }
}

export default SelectField;
