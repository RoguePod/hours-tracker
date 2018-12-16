import { FieldError } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import cx from 'classnames';

class CheckboxField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    }).isRequired,
    label: PropTypes.node.isRequired,
    meta: PropTypes.shape({
      errpr: PropTypes.string,
      touched: PropTypes.bool
    }).isRequired
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _handleChange() {
    const { input: { onChange, value } } = this.props;

    onChange(!value);
  }

  render() {
    const { input, label, meta } = this.props;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    const labelClassName = cx(
      'block flex flex-row items-center cursor-pointer',
      {
        'text-grey-darker': !isError,
        'text-red': isError
      }
    );

    return (
      <div className="mb-4">
        <label
          className={labelClassName}
          onClick={this._handleChange}
        >
          {!input.value &&
            <FontAwesomeIcon
              icon={['far', 'square']}
            />}
          {input.value &&
            <FontAwesomeIcon
              icon={['far', 'check-square']}
            />}
          <div
            className="ml-2"
          >
            {label}
          </div>
        </label>
        <FieldError
          error={meta.error}
          touched={meta.touched}
        />
      </div>
    );
  }
}

export default CheckboxField;
