import { FieldError, Label } from 'javascripts/shared/components';
import {
  selectClientsByKey,
  selectQueriedClients
} from 'javascripts/app/redux/clients';

import ClientsDropdown from './ClientsDropdown';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _get from 'lodash/get';
import _uniqueId from 'lodash/uniqueId';
import { connect } from 'react-redux';
import cx from 'classnames';

class ClientField extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    clientRef: PropTypes.docRef,
    clients: PropTypes.docRef.isRequired,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    nameClient: PropTypes.string.isRequired,
    onClientChange: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired,
    required: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.client).isRequired
  }

  static defaultProps = {
    className: null,
    clientRef: null,
    disabled: false,
    id: null,
    label: null,
    required: false
  }

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      id: props.id || _uniqueId('input_')
    };

    this._handleChange = this._handleChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._findValue = this._findValue.bind(this);
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

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  timeout = null

  _handleChange(client) {
    const {
      field: { name }, form: { setFieldValue }, onClientChange
    } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onClientChange(client.clientRef);
    setFieldValue(name, '');
    this.setState({ focused: false });
  }

  _handleBlur() {
    const {
      field: { name, value }, form: { setFieldValue }, onClientChange
    } = this.props;

    this.timeout = setTimeout(() => {
      if (value.length === 0) {
        onClientChange(null);
      }
      setFieldValue(name, '');
      this.setState({ focused: false });
    }, 250);
  }

  _handleFocus({ target }) {
    const { field: { name }, form: { setFieldValue } } = this.props;

    setFieldValue(name, this._findValue());

    this.setState({ focused: true }, () => {
      setTimeout(() => {
        target.select();
      }, 1);
    });
  }

  _findValue() {
    const { clients, clientRef, ready } = this.props;

    if (!ready) {
      return '';
    }

    const client = _get(clients, _get(clientRef, 'id'));

    if (client) {
      return client.name;
    }

    return '';
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className, clientRef, clients, disabled, field,
      form: { errors, isSubmitting, touched },
      label, nameClient, onClientChange, ready, required, results, ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */
    const { focused, id } = this.state;

    const hasError = errors[field.name] && touched[field.name];

    let { value } = field;

    if (!focused) {
      value = this._findValue();
    }

    const inputClassName = cx(
      'appearance-none border w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !hasError,
        'border-red': hasError,
        'focus:border-blue-light': !hasError,
        'focus:border-red': hasError,
        'rounded': results.length === 0,
        'rounded-t': results.length > 0
      },
      className
    );

    const inputId = id ? id : _uniqueId('input_');

    return (
      <div className="relative">
        {label &&
          <Label
            error={hasError}
            htmlFor={inputId}
            required={required}
          >
            {label}
          </Label>}
        <input
          {...field}
          {...rest}
          className={inputClassName}
          disabled={!ready || disabled || isSubmitting}
          id={id}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          value={value}
        />
        <ClientsDropdown
          clients={results}
          onClientClick={this._handleChange}
        />
        <FieldError
          error={errors[field.name]}
          touched={touched[field.name]}
        />
      </div>
    );
  }
}

const props = (state, ownProps) => {
  const { field: { value }, form: { values }, nameClient } = ownProps;

  return {
    clientRef: values[nameClient],
    clients: selectClientsByKey(state),
    ready: state.clients.ready,
    results: selectQueriedClients(state, value)
  };
};

const actions = {};

export default connect(props, actions)(ClientField);
