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
import { formValueSelector } from 'redux-form';

class ClientField extends React.Component {
  static propTypes = {
    clientRef: PropTypes.docRef,
    clients: PropTypes.docRef.isRequired,
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string
    }).isRequired,
    label: PropTypes.string,
    meta: PropTypes.shape({
      errpr: PropTypes.string,
      touched: PropTypes.bool
    }).isRequired,
    onClientChange: PropTypes.func.isRequired,
    ready: PropTypes.bool.isRequired,
    results: PropTypes.arrayOf(PropTypes.client).isRequired
  }

  static defaultProps = {
    clientRef: null,
    id: null,
    label: null
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._findValue = this._findValue.bind(this);
  }

  state = {
    focused: false
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  timeout = null

  _handleChange(client) {
    const { input: { onChange }, onClientChange } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    onClientChange(client.clientRef);
    onChange('');
    this.setState({ focused: false });
  }

  _handleBlur() {
    const { input: { onChange, value }, onClientChange } = this.props;

    this.timeout = setTimeout(() => {
      if (value.length === 0) {
        onClientChange(null);
      }
      onChange('');
      this.setState({ focused: false });
    }, 250);
  }

  _handleFocus(event) {
    const { input: { onChange } } = this.props;

    const { target } = event;

    onChange(this._findValue());

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
    const { className, id, input, label, meta, ready, results } = this.props;
    const { focused } = this.state;

    /* eslint-disable no-unneeded-ternary */
    const isError = meta.touched && meta.error ? true : false;
    /* eslint-enable no-unneeded-ternary */

    let { value } = input;

    if (!focused) {
      value = this._findValue();
    }

    const inputClassName = cx(
      'appearance-none border w-full py-2 px-3 text-grey-darker',
      'leading-tight focus:outline-none transition',
      {
        'border-grey-light': !isError,
        'border-red': isError,
        'focus:border-blue-light': !isError,
        'focus:border-red': isError,
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
            error={isError}
            htmlFor={inputId}
          >
            {label}
          </Label>}
        <input
          {...input}
          className={inputClassName}
          disabled={!ready}
          id={inputId}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          value={value}
        />
        <ClientsDropdown
          clients={results}
          onClientClick={this._handleChange}
        />
        <FieldError {...meta} />
      </div>
    );
  }
}

const props = (state, ownProps) => {
  const { input: { name }, meta: { form }, nameClient } = ownProps;

  const formSelector = formValueSelector(form);
  const query        = formSelector(state, name);

  return {
    clientRef: formSelector(state, nameClient),
    clients: selectClientsByKey(state),
    ready: state.clients.ready,
    results: selectQueriedClients(state, query)
  };
};

const actions = {};

export default connect(props, actions)(ClientField);
