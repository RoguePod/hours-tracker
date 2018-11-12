import { FieldError, FieldWarning } from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

class CheckboxField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.bool
    }).isRequired,
    label: PropTypes.node.isRequired,
    meta: PropTypes.shape({
      errpr: PropTypes.string,
      touched: PropTypes.bool
    }).isRequired
  }

  static defaultProps = {
    className: ''
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
    const { className, input, label, meta, ...rest } = this.props;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    const inputClassName = cx(
      className
    );

    const labelClassName = cx(
      'text-grey-darker ml-2',
      {
        'text-grey-darker': !isError,
        'text-red': isError
      }
    );

    return (
      <div className="mb-4">
        <label className="block flex flex-row items-center">
          <input
            {...input}
            {...rest}
            checked={input.value}
            className={inputClassName}
            type="checkbox"
          />
          <div
            className={labelClassName}
          >
            {label}
          </div>
        </label>
        <FieldError {...meta} />
        <FieldWarning {...meta} />
      </div>
    );
  }
}

export default CheckboxField;
