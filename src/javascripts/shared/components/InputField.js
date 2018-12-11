import { FieldError, Label } from 'javascripts/shared/components';

import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import cx from 'classnames';

class InputField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
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
    className: null,
    id: null,
    label: null
  }

  constructor(props) {
    super(props);

    this.state = {
      id: props.id ? props.id : _uniqueId('input_')
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
    const { className, input, label, meta, ...rest } = this.props;
    const { id } = this.state;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    const inputClassName = cx(
      'appearance-none border rounded w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !isError,
        'border-red': isError,
        'focus:border-blue-light': !isError,
        'focus:border-red': isError
      },
      className
    );

    return (
      <React.Fragment>
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
        />
        <FieldError
          error={meta.error}
          touched={meta.touched}
        />
      </React.Fragment>
    );
  }
}

export default InputField;
