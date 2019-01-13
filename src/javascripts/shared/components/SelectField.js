import { FieldError, Label } from 'javascripts/shared/components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import cx from 'classnames';

class SelectField extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool
  }

  static defaultProps = {
    children: null,
    className: null,
    disabled: false,
    id: null,
    label: null,
    required: false
  }

  constructor(props) {
    super(props);

    this.state = {
      id: props.id || _uniqueId('input_')
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      if (id) {
        this.setState({ id });
      } else if (!id && prevProps.id) {
        this.setState({ id: _uniqueId('input_') });
      }
    }
  }

  render() {
    const {
      children, className, disabled, field,
      form: { errors, isSubmitting, touched }, label, required, ...rest
    } = this.props;
    const { id } = this.state;

    const hasError = errors[field.name] && touched[field.name];

    const inputClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none bg-white cursor-pointer h-full ' +
      'transition',
      {
        'border-grey-light': !hasError,
        'border-red': hasError,
        'focus:border-blue-light': !hasError,
        'focus:border-red': hasError
      },
      className
    );

    const arrowClasses =
      'pointer-events-none absolute pin-y pin-r flex items-center px-4';

    return (
      <>
        {label && label.length > 0 &&
          <Label
            error={hasError}
            htmlFor={id}
            required={required}
          >
            {label}
          </Label>}

        <div className="relative">
          <select
            {...field}
            {...rest}
            className={inputClassName}
            disabled={disabled || isSubmitting}
            id={id}
          >
            {children}
          </select>
          <div className={arrowClasses}>
            <FontAwesomeIcon
              icon="caret-down"
            />
          </div>
        </div>
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
      </>
    );
  }
}

export default SelectField;
