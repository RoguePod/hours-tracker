import {
  Dropdown,
  FieldError,
  InputBase
} from 'javascripts/shared/components';

import ClientRow from './ClientRow';
import Fuse from 'fuse.js';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { fuseOptions } from 'javascripts/app/redux/clients';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
`;

class ClientField extends React.Component {
  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.client).isRequired,
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    projectField: PropTypes.string,
    ready: PropTypes.bool.isRequired
  }

  static defaultProps = {
    disabled: false,
    projectField: null
  }

  constructor(props) {
    super(props);

    this._handleChange = this._handleChange.bind(this);
    this._handleDropdownChange = this._handleDropdownChange.bind(this);
    this._handleBlur = this._handleBlur.bind(this);
    this._handleFocus = this._handleFocus.bind(this);
    this._findValue = this._findValue.bind(this);

    this.state = {
      focused: false,
      value: this._findValue(props.field.value)
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(prevProps) {
    const { clients, field: { value }, ready } = this.props;

    if (!_isEqual(prevProps.field.value, value) ||
        !_isEqual(clients, prevProps.clients) ||
        ready !== prevProps.ready) {
      this.setState({ value: this._findValue(value) });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  changing = false

  _handleChange({ target: { value } }) {
    this.setState({ value });
  }

  _handleDropdownChange(client) {
    this.changing = true;

    const {
      field: { name, value }, form: { setFieldTouched, setFieldValue },
      projectField
    } = this.props;

    if (!_isEqual(client.id, value)) {
      setFieldTouched(name, true);
      setFieldValue(name, client.id);

      if (projectField) {
        setFieldTouched(projectField, true);
        setFieldValue(projectField, null);
      }
    }

    this.setState({
      focused: false, value: this._findValue(client.id)
    });
  }

  _handleBlur() {
    const {
      field, form: { setFieldTouched, setFieldValue }, projectField
    } = this.props;
    const { value } = this.state;

    if (this.changing) {
      return;
    }

    if (value.length === 0) {
      setFieldTouched(field.name, true);
      setFieldValue(field.name, null);

      if (projectField) {
        setFieldTouched(projectField, true);
        setFieldValue(projectField, null);
      }

      this.setState({ focused: false, value: this._findValue(null) });
    } else {
      this.setState({ focused: false, value: this._findValue(field.value) });
    }
  }

  _handleFocus({ target }) {
    this.changing = false;
    const { field: { value } } = this.props;

    this.setState({ focused: true, value: this._findValue(value) }, () => {
      setTimeout(() => {
        target.select();
      }, 1);
    });
  }

  _findValue(clientId) {
    const { clients, ready } = this.props;

    if (!ready || isBlank(clientId)) {
      return '';
    }

    const foundClient = _find(clients, (client) => {
      return client.id === clientId;
    });

    if (foundClient) {
      return foundClient.name;
    }

    return '';
  }

  _findResults(value) {
    const { clients } = this.props;
    let results = clients;

    if (!isBlank(value)) {
      results = new Fuse(clients, fuseOptions).search(value);
    }

    return results;
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      clients, disabled, field, form: { errors, isSubmitting, touched },
      ready, ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    const { focused, value } = this.state;
    const hasError = errors[field.name] && touched[field.name];

    const rows = (focused ? this._findResults(value) : []).map((client) => {
      return (
        <React.Fragment
          key={client.id}
        >
          <Divider className="bg-grey-lighter" />
          <ClientRow
            client={client}
            onChange={this._handleDropdownChange}
          />
        </React.Fragment>
      );
    });

    return (
      <div className="relative">
        <InputBase
          {...rest}
          disabled={!ready || disabled || isSubmitting}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          value={value}
        />
        <Dropdown
          error={hasError}
          open={focused}
        >
          {rows}
        </Dropdown>
        <FieldError
          error={errors[field.name]}
          touched={Boolean(touched[field.name])}
        />
      </div>
    );
  }
}

const props = (state) => {
  return {
    clients: state.clients.clients,
    ready: state.clients.ready
  };
};

const actions = {};

export default connect(props, actions)(ClientField);
