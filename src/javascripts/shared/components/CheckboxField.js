import { FieldError } from "javascripts/shared/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "javascripts/prop-types";
import React from "react";
import cx from "classnames";

class CheckboxField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    label: PropTypes.string
  };

  static defaultProps = {
    disabled: false,
    label: null
  };

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleChange() {
    const {
      disabled,
      field: { name, value },
      form: { isSubmitting, setFieldValue }
    } = this.props;

    if (disabled || isSubmitting) {
      return;
    }

    setFieldValue(name, !value);
  }

  render() {
    const {
      disabled,
      field: { name, value },
      form: { errors, isSubmitting, touched },
      label
    } = this.props;

    const hasError = errors[name] && touched[name];
    const isDisabled = disabled || isSubmitting;
    const icon = value ? ["far", "check-square"] : ["far", "square"];

    const labelClassName = cx(
      "block flex flex-row items-center cursor-pointer",
      {
        "text-grey-darker": !hasError && !isDisabled,
        "text-grey-light": !hasError && isDisabled,
        "text-red": hasError
      }
    );

    return (
      <>
        <label className={labelClassName} onClick={this._handleChange}>
          <FontAwesomeIcon icon={icon} />
          <div className="ml-2">{label}</div>
        </label>
        <FieldError error={errors[name]} touched={touched[name]} />
      </>
    );
  }
}

export default CheckboxField;
