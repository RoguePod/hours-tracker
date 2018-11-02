import { FieldError, FieldWarning, Label } from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

class InputField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
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
    className: '',
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
    const { className, label, id, input, meta, ...rest } = this.props;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    const inputClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none',
      {
        'border-grey-light': !isError,
        'border-red': isError,
        'focus:border-blue-light': !isError,
        'focus:border-red': isError
      },
      className
    );

    return (
      <div className="mb-4">
        {label &&
          <Label
            error={isError}
            htmlFor={id}
          >
            {label}
          </Label>}
        <input
          {...input}
          {...rest}
          className={inputClassName}
          id={id}
          ref={this._handleRef}
        />
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </div>
    );
  }
}

export default InputField;
