import {
  Dropdown,
  FieldError,
  InputBase,
  Label
} from 'javascripts/shared/components';

import Fuse from 'fuse.js';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import UserRow from './UserRow';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { fuseOptions } from 'javascripts/app/redux/users';
import { isBlank } from 'javascripts/globals';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
`;

class UserField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.field.isRequired,
    form: PropTypes.form.isRequired,
    label: PropTypes.string,
    ready: PropTypes.bool.isRequired,
    required: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.user).isRequired
  }

  static defaultProps = {
    disabled: false,
    label: null,
    required: false
  }

  constructor(props) {
    super(props);

    this.input = React.createRef();
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
    const { field: { value }, ready, users } = this.props;

    if (!_isEqual(prevProps.field.value, value) ||
        !_isEqual(users, prevProps.users) ||
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

  _handleDropdownChange(user) {
    this.changing = true;

    const {
      field: { name, value }, form: { setFieldTouched, setFieldValue }
    } = this.props;

    if (!_isEqual(user.id, value)) {
      setFieldTouched(name, true);
      setFieldValue(name, user.id);
    }

    this.setState({
      focused: false, value: this._findValue(user.id)
    });
  }

  _handleBlur() {
    const { field, form: { setFieldTouched, setFieldValue } } = this.props;
    const { value } = this.state;

    if (this.changing) {
      return;
    }

    if (value.length === 0) {
      setFieldTouched(field.name, true);
      setFieldValue(field.name, null);

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

  _findValue(userId) {
    const { ready, users } = this.props;

    if (!ready || isBlank(userId)) {
      return '';
    }

    const foundUser = _find(users, (user) => {
      return user.id === userId;
    });

    if (foundUser) {
      return foundUser.name;
    }

    return '';
  }

  _findResults(value) {
    const { users } = this.props;
    let results = users;

    if (!isBlank(value)) {
      results = new Fuse(users, fuseOptions).search(value);
    }

    return results;
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      disabled, field, form: { errors, isSubmitting, touched },
      label, ready, required, users, ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    const { focused, value } = this.state;
    const hasError = errors[field.name] && touched[field.name];

    const rows = (focused ? this._findResults(value) : []).map((user) => {
      return (
        <React.Fragment
          key={user.id}
        >
          <Divider className="bg-grey-lighter" />
          <UserRow
            onChange={this._handleDropdownChange}
            user={user}
          />
        </React.Fragment>
      );
    });

    return (
      <div className="relative">
        {label &&
          <Label
            error={hasError}
            htmlFor={this.input?.current?.id()}
            required={required}
          >
            {label}
          </Label>}
        <InputBase
          {...rest}
          disabled={!ready || disabled || isSubmitting}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          ref={this.input}
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
    ready: state.users.ready,
    users: state.users.users
  };
};

const actions = {};

export default connect(props, actions)(UserField);
